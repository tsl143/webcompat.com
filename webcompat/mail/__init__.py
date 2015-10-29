#!/usr/bin/env python
# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from email.mime.text import MIMEText
from webcompat.helpers import STATIC_PATH
import smtplib

SENDER = 'webcompat.com bot <compatbot@webcompat.com>'

def confirm_new_subscription(mail, domain, secret):
    f = open(STATIC_PATH + '/mailtemplates/confirm.txt')
    msg = MIMEText(f.read().format(**{'mail':mail, 'domain':domain, 'secret':secret}))
    f.close()
    msg['Subject'] = 'Confirm webcompat.com subscription'
    msg['From'] = SENDER
    msg['To'] = [mail]
    s = smtplib.SMTP('localhost')
    s.sendmail(SENDER, [mail], msg.as_string())
    s.quit()


