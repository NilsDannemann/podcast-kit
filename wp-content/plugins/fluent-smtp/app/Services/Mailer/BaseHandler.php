<?php

namespace FluentMail\App\Services\Mailer;

use Exception;
use FluentMail\App\Models\Logger;
use FluentMail\Includes\Support\Arr;
use FluentMail\Includes\Core\Application;
use FluentMail\App\Services\Mailer\Manager;
use FluentMail\App\Services\Mailer\ValidatorTrait;

class BaseHandler
{
    use ValidatorTrait;

    protected $app = null;
    
    protected $params = [];

    protected $manager = null;
    
    protected $phpMailer = null;

    protected $settings = [];

    protected $attributes = [];

    protected $response = null;

    public function __construct(Application $app = null, Manager $manager = null)
    {
        $this->app = $app ?: fluentMail();
        $this->manager = $manager ?: fluentMail(Manager::class);
    }

    public function setPhpMailer($phpMailer)
    {
        $this->phpMailer = $phpMailer;

        if(!$this->phpMailer->CharSet) {
            $this->phpMailer->CharSet = 'UTF-8';
        }

        return $this;
    }

    public function setSettings($settings)
    {
        $this->settings = $settings;

        return $this;
    }

    protected function preSend()
    {
        $this->attributes = [];
        
        if ($this->isForced('from_name')) {
            $this->phpMailer->FromName = $this->getSetting('sender_name');
        }

        $title = ucwords($this->getSetting('provider'));
        $this->phpMailer->addCustomHeader(
            'X-Mailer', 'FluentMail - ' . $title
        );

        if ($this->getSetting('return_path') == 'yes') {
            $this->phpMailer->Sender = $this->phpMailer->From;
        }

        $this->attributes = $this->setAttributes();

        return true;
    }

    protected function isForced($key)
    {
        return $this->getSetting("force_{$key}") == 'yes';
    }

    public function isActive()
    {
        return $this->getSetting('is_active') == 'yes';
    }

    protected function getDefaultParams()
    {
        $timeout = (int)ini_get('max_execution_time');

        return [
            'timeout'     => $timeout ?: 30,
            'httpversion' => '1.1',
            'blocking'    => true,
        ];
    }

    protected function setAttributes()
    {
        $from = $this->setFrom();
        
        $replyTos = $this->setRecipientsArray(array_values(
            $this->phpMailer->getReplyToAddresses()
        ));
        
        $contentType = $this->phpMailer->ContentType;
        
        $customHeaders = $this->setFormattedCustomHeaders();

        $recipients = [
            'to' => $this->setRecipientsArray($this->phpMailer->getToAddresses()),
            'cc' => $this->setRecipientsArray($this->phpMailer->getCcAddresses()),
            'bcc' => $this->setRecipientsArray($this->phpMailer->getBccAddresses())
        ];

        return array_merge($this->attributes, [
            'from' => $from,
            'to' => $recipients['to'],
            'subject' => $this->phpMailer->Subject,
            'message' => $this->phpMailer->Body,
            'attachments' => $this->phpMailer->getAttachments(),
            'custom_headers' => $customHeaders,
            'headers' => [
                'reply-to' => $replyTos,
                'cc' => $recipients['cc'],
                'bcc' => $recipients['bcc'],
                'content-type' => $contentType
            ]
        ]);
    }

    protected function setFrom()
    {
        $name = $this->getSetting('sender_name');
        $email = $this->getSetting('sender_email');
        $overrideName = $this->getSetting('force_from_name');

        if ($name && ($overrideName == 'yes' || $this->phpMailer->FromName == 'WordPress')) {
            $this->attributes['sender_name'] = $name;
            $this->attributes['sender_email'] = $email;
            $from = $name . ' <' . $email . '>';
        } elseif ($this->phpMailer->FromName) {
            $this->attributes['sender_email'] = $email;
            $this->attributes['sender_name'] = $this->phpMailer->FromName;
            $from = $this->phpMailer->FromName . ' <' . $email . '>';
        } else {
            $from = $this->attributes['sender_email'] = $email;
        }

        return $from;
    }

    protected function setRecipientsArray($array)
    {
        $recipients = [];

        foreach ($array as $key => $recipient) {
            $recipient = array_filter($recipient);

            if (!$recipient) continue;
            
            $recipients[$key] = [
                'email' => array_shift($recipient)
            ];

            if ($recipient) {
                $recipients[$key]['name'] = array_shift($recipient);
            }
        }

        return $recipients;
    }

    protected function setFormattedCustomHeaders()
    {
        $headers = [];

        $customHeaders = $this->phpMailer->getCustomHeaders();

        foreach ($customHeaders as $key => $header) {
            if ($header[0] == 'Return-Path') {
                if ($this->getSetting('options.return_path') == 'no') {
                    if (!empty($header[1])) {
                        $this->phpMailer->Sender = $header[1];
                    }
                }
                unset($customHeaders[$key]);
            } else {
                $headers[] = [
                    'key' => $header[0],
                    'value' => $header[1]
                ];
            }
        }

        $this->phpMailer->clearCustomHeaders();

        foreach ($customHeaders as $customHeader) {
            $this->phpMailer->addCustomHeader($header[0], $header[1]);
        }

        return $headers;
    }

    public function getSetting($key = null, $default = null)
    {
        try {
            return $key ? Arr::get($this->settings, $key, $default) : $this->settings;
        } catch (Exception $e) {
            return $default;
        }
    }

    protected function getParam($key = null, $default = null)
    {
        try {
            return $key ? Arr::get($this->attributes, $key, $default) : $this->attributes;
        } catch (Exception $e) {
            return $default;
        }
    }

    protected function getHeader($key, $default = null)
    {
        try {
            return Arr::get(
                $this->attributes['headers'], $key, $default
            );
        } catch (Exception $e) {
            return $default;
        }
    }

    public function getSubject()
    {
        $subject = '';

        if (isset($this->attributes['subject'])) {
            $subject = $this->attributes['subject'];
        }

        return $subject;
    }

    protected function getExtraParams()
    {
        $this->attributes['extra']['provider'] = $this->getSetting('provider');

        return $this->attributes['extra'];
    }

    public function handleResponse($response)
    {
        if (is_wp_error($response)) {
            $message = 'Oops!';

            $code = $response->get_error_code();

            if (!is_numeric($code)) {
                $message = ucwords(str_replace(['_', '-'], ' ', $code));
                $code = 400;
            }

            $response = [
                'code'    => $code,
                'message' => $message,
                'errors'  => $response->get_error_messages()
            ];

            $this->processResponse($response, false);

            $this->fireWPMailFailedAction($response);

        } else {
            if ($this->isEmailSent()) {
                return $this->handleSuccess();
            } else {
                return $this->handleFailure();
            }
        }
    }

    public function processResponse($response, $status)
    {
        if ($this->shouldBeLogged($status)) {
            $data = [
                'to' => maybe_serialize($this->attributes['to']),
                'from' => $this->attributes['from'],
                'subject' => $this->attributes['subject'],
                'body' => $this->attributes['message'],
                'attachments' => maybe_serialize($this->attributes['attachments']),
                'status'   => $status ? 'sent' : 'failed',
                'response' => maybe_serialize($response),
                'headers'  => maybe_serialize($this->getParam('headers')),
                'extra'    => maybe_serialize($this->getExtraParams())
            ];

            (new Logger)->add($data);
        }

        return $status;
    }

    protected function shouldBeLogged($status)
    {
        if (defined('FLUENTMAIL_LOG_OFF') && FLUENTMAIL_LOG_OFF) {
            return false;
        }

        if (!$status) {
            return true;
        }

        $miscSettings = $this->manager->getConfig('misc');
        $isLogOn = $miscSettings['log_emails'] == 'yes';

        return apply_filters('fluentmail_will_log_email', $isLogOn, $miscSettings);
    }

    protected function fireWPMailFailedAction($data)
    {
        $code = is_numeric($data['code']) ? $data['code'] : 400;
        $code = strlen($code) < 3 ? 400 : $code;

        $this->app->doAction('wp_mail_failed', new \WP_Error(
            $code, $data['message'], $data['errors']
        ));
    }

    protected function updatedLog($id, $data)
    {
        try {
            $data['updated_at'] = current_time('mysql');
            (new Logger)->updateLog($data, ['id' => $id]);
        } catch (Exception $e) {
            error_log($e->getMessage());
        }
    }

    public function getValidSenders($connection)
    {
        return [$connection['sender_email']];
    }

    public function checkConnection($connection)
    {
        return true;
    }

    public function getConnectionInfo($connection)
    {
        return (string) fluentMail('view')->make('admin.general_connection_info', [
            'connection' => $connection
        ]);
    }
}
