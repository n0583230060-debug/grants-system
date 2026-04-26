import { Resend } from 'resend'
import { s, colors } from './email.styles.js'

const getResend = () => new Resend(process.env.RESEND_API_KEY)
const STATUS_URL = `${process.env.CLIENT_URL || 'http://localhost:5173'}/viewStatus`

const emailWrapper = (content) => `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head><meta charset="UTF-8"/></head>
<body style="${s.body}">
  <table width="100%" cellpadding="0" cellspacing="0" style="${s.outerTable}">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="${s.card}">

        <tr>
          <td style="${s.header}">
            <span style="${s.headerText}">מערכת מלגות</span>
          </td>
        </tr>

        <tr>
          <td style="${s.content}">
            ${content}
          </td>
        </tr>

        <tr>
          <td style="${s.footer}">
            <p style="${s.footerText}">הודעה זו נשלחה אוטומטית ממערכת מלגות. אין להשיב למייל זה.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
`

const actionButton = (url, label, color = colors.accent) =>
    `<a href="${url}" style="${s.button(color)}">${label}</a>`

export const sendRequestConfirmation = async (email, firstName) => {
    if (!email) return
    try {
        await getResend().emails.send({
            from: 'מערכת מלגות <onboarding@resend.dev>',
            to: email,
            subject: 'בקשת המענק שלך התקבלה',
            html: emailWrapper(`
                <h2 style="${s.h2}">שלום ${firstName},</h2>
                <p style="${s.bodyText}">
                    בקשת המענק שלך <strong style="color:${colors.text}">התקבלה בהצלחה</strong> ונמצאת כעת בבדיקה.
                </p>

                <div style="${s.statusBox(colors.bgInput, colors.accent)}">
                    <p style="${s.statusLabel}">סטטוס הבקשה</p>
                    <p style="${s.statusValue(colors.accent)}">ממתינה לבדיקה</p>
                </div>

                <p style="${s.smallText}">נעדכן אותך במייל כאשר יהיה שינוי בסטטוס הבקשה.</p>

                ${actionButton(STATUS_URL, 'לצפייה בסטטוס הבקשה')}
            `)
        })
    } catch (err) {
        console.error('שגיאה בשליחת אימייל:', err)
    }
}

export const sendStatusUpdate = async (email, firstName, status) => {
    if (!email) return
    try {
        const isApproved = status === 'approved'
        const statusColor = isApproved ? colors.accent : colors.text
        const statusBg = isApproved ? colors.bgAccentLight : colors.bgInput

        await getResend().emails.send({
            from: 'מערכת מלגות <onboarding@resend.dev>',
            to: email,
            subject: `עדכון סטטוס בקשת המענק שלך — ${isApproved ? 'אושרה' : 'נדחתה'}`,
            html: emailWrapper(`
                <h2 style="${s.h2}">שלום ${firstName},</h2>
                <p style="${s.bodyText}">קיבלנו עדכון לגבי בקשת המענק שלך.</p>

                <div style="${s.statusBox(statusBg, statusColor)}">
                    <p style="${s.statusLabel}">סטטוס הבקשה</p>
                    <p style="${s.statusValue(statusColor)}">
                        ${isApproved ? '✓ אושרה' : '✕ נדחתה'}
                    </p>
                </div>

                <p style="${s.smallText}">
                    ${isApproved
                        ? 'ברכות! בקשתך אושרה. נציג מטעמנו יצור איתך קשר בקרוב לגבי קבלת המענק.'
                        : 'לצערנו בקשתך לא אושרה הפעם. ניתן לפנות אלינו לקבלת מידע נוסף.'
                    }
                </p>

                ${actionButton(STATUS_URL, 'לצפייה בסטטוס הבקשה', statusColor)}
            `)
        })
    } catch (err) {
        console.error('שגיאה בשליחת אימייל:', err)
    }
}
