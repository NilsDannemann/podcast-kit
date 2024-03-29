<?php

namespace FluentMail\App\Services\Mailer\Providers\SendInBlue;

use WP_Error as WPError;
use FluentMail\Includes\Support\Arr;
use FluentMail\Includes\Core\Application;
use FluentMail\App\Services\Mailer\Manager;
use FluentMail\App\Services\Mailer\BaseHandler;
use FluentMail\App\Services\Mailer\Providers\SendInBlue\ValidatorTrait;

class Handler extends BaseHandler
{
    use ValidatorTrait;
    
    protected $emailSentCode = 201;

    protected $url = 'https://api.sendinblue.com/v3/smtp/email';

    protected $allowedAttachmentExts = [
        'xlsx', 'xls', 'ods', 'docx', 'docm', 'doc', 'csv', 'pdf', 'txt', 'gif',
        'jpg', 'jpeg', 'png', 'tif', 'tiff', 'rtf', 'bmp', 'cgm', 'css', 'shtml',
        'html', 'htm', 'zip', 'xml', 'ppt', 'pptx', 'tar', 'ez', 'ics', 'mobi',
        'msg', 'pub', 'eps', 'odt', 'mp3', 'm4a', 'm4v', 'wma', 'ogg', 'flac',
        'wav', 'aif', 'aifc', 'aiff', 'mp4', 'mov', 'avi', 'mkv', 'mpeg', 'mpg', 'wmv'
    ];

    public function send()
    {
        if ($this->preSend()) {
            return $this->postSend();
        }

        $this->handleFailure(new Exception('Something went wrong!', 0));
    }

    public function postSend()
    {
        $body = [
            'sender' => $this->getFrom(),
            'subject' => $this->getSubject(),
            'htmlContent' => $this->getBody(),
            'headers' => $this->getCustomEmailHeaders()
        ];

        if ($replyTo = $this->getReplyTo()) {
            $body['replyTo'] = $replyTo;
        }
        
        $recipients = $this->setRecipients();

        $body = array_merge($body, $recipients);

        if (!empty($this->getParam('attachments'))) {
            $body['attachment'] = $this->getAttachments();
        }

        $params = [
            'body' => json_encode($body),
            'headers' => $this->getRequestHeaders()
        ];

        $params = array_merge($params, $this->getDefaultParams());

        $this->response = wp_safe_remote_post($this->url, $params);

        return $this->handleResponse($this->response);
    }

    public function setSettings($settings)
    {
        if($settings['key_store'] == 'wp_config') {
            $settings['api_key'] = defined('FLUENTMAIL_SENDINBLUE_API_KEY') ? FLUENTMAIL_SENDINBLUE_API_KEY : '';
        }
        $this->settings = $settings;
        return $this;
    }

    protected function getFrom()
    {
        return [
            'name' => $this->getParam('sender_name'),
            'email' => $this->getParam('sender_email')
        ];
    }

    protected function getReplyTo()
    {
        if ($replyTo = $this->getParam('headers.reply-to')) {
            return reset($replyTo);
        }
    }

    protected function setRecipients()
    {
        $recipients = [
            'to' => $this->getTo(),
            'cc' => $this->getCarbonCopy(),
            'bcc' => $this->getBlindCarbonCopy()
        ];

        $recipients = array_filter($recipients);

        foreach ($recipients as $key => $recipient) {
            $array = array_map(function($recipient) {
                return isset($recipient['name'])
                ? $recipient['name'] . ' <' . $recipient['email'] . '>'
                : $recipient['email'];
           }, $recipient);

            $this->attributes['formatted'][$key] = implode(', ', $array);
        }

        return $recipients;
    }

    protected function getTo()
    {
        return $this->getParam('to');
    }

    protected function getCarbonCopy()
    {
        return $this->getParam('headers.cc');
    }

    protected function getBlindCarbonCopy()
    {
       return $this->getParam('headers.bcc');
    }

    protected function getBody()
    {
        return $this->getParam('message');
    }

    protected function getAttachments()
    {
        $files = [];

        foreach ($this->getParam('attachments') as $attachment) {
            if (is_file($attachment[0]) && is_readable($attachment[0])) {
                $ext = pathinfo($attachment[0], PATHINFO_EXTENSION);

                if (in_array($ext, $this->allowedAttachmentExts, true)) {
                    $files[] = [
                        'name' => basename($attachment[0]),
                        'content' => base64_encode(file_get_contents($attachment[0]))
                    ];
                }
            }
        }

        return $files;
    }

    protected function getCustomEmailHeaders()
    {
        return [
            'X-Mailer' => 'FluentMail - SendInBlue'
        ];
    }

    protected function getRequestHeaders()
    {
        return [
            'X-Mailer' => 'FluentMail-SendInBlue',
            'Api-Key' => $this->getSetting('api_key'),
            'Content-Type' => 'application/json',
            'Accept' => 'application/json'
        ];
    }

    public function isEmailSent()
    {
        $isSent = wp_remote_retrieve_response_code($this->response) == $this->emailSentCode;

        if (
            $isSent &&
            isset($this->response['body']) &&
            !json_decode($this->response['body'], true)['messageId']
        ) {
            return false;
        }

        return $isSent;
    }

    protected function handleSuccess()
    {
        $response = $this->response['response'];

        $body = (array) wp_remote_retrieve_body($this->response);
        
        $body = json_decode($body[0], true);

        $response = array_merge($body, $response);

        return $this->processResponse(['response' => $response], true);
    }

    protected function handleFailure()
    {
        $response = $this->getResponseError();

        $this->processResponse(['response' => $response], false);

        $this->fireWPMailFailedAction($response);
    }

    public function getResponseError()
    {
        $response = $this->response;
        
        $body = json_decode($response['body'], true);
        
        $response = $response['response'];

        $message = ucwords($body['code']) . ' - ' . $body['message'];

        return [
            'message' => $response['message'],
            'code' => $response['code'],
            'errors' => [$message]
        ];
    }
}
