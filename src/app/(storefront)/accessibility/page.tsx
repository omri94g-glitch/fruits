import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "הצהרת נגישות | Rfruits",
  description: "הצהרת הנגישות של אתר Rfruits והדרכים לפנות אלינו בנושא נגישות.",
};

export default function AccessibilityStatementPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 flex flex-col gap-8">
      <h1 className="font-serif text-3xl text-ink text-center">הצהרת נגישות</h1>

      <section className="flex flex-col gap-3">
        <p className="text-ink">
          ב-{siteConfig.name} אנחנו רוצים שכל אחד ואחת יוכלו להזמין מגשי פירות באתר שלנו בקלות
          ובעצמאות, כולל אנשים עם מוגבלות. אנחנו פועלים להנגשת האתר ולשיפור מתמיד של חוויית השימוש בו.
        </p>
        <p className="text-ink">
          האתר מתוכנן במטרה לעמוד בדרישות תקן ישראלי ת&quot;י 5568 (המבוסס על הנחיות WCAG 2.0 ברמה AA).
          הנגשת האתר היא תהליך מתמשך, ויתכן שחלקים מסוימים בו טרם הונגשו במלואם.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-serif text-xl text-ink">מה כבר קיים באתר</h2>
        <ul className="list-disc pr-6 flex flex-col gap-2 text-ink">
          <li>תפריט נגישות (הכפתור בפינה הימנית התחתונה) להגדלת טקסט, ניגודיות גבוהה, גווני אפור, הדגשת קישורים, גופן קריא ועצירת אנימציות.</li>
          <li>ניווט מלא באמצעות המקלדת, כולל סימון ברור של האלמנט הפעיל וקישור &quot;דלגו לתוכן הראשי&quot;.</li>
          <li>חלונות העגלה וההזמנה המהירה נסגרים ב-Escape, שומרים על המיקוד בתוכם ומחזירים אותו בסגירה.</li>
          <li>תוויות לשדות הטפסים, הודעות שגיאה שמוקראות לקורא מסך, והשלמה אוטומטית לפרטי הלקוח.</li>
          <li>שפת האתר (עברית) וכיוון הכתיבה (מימין לשמאל) מוגדרים בקוד, כדי שקוראי מסך יקראו את התוכן נכון.</li>
          <li>כיבוד הגדרת &quot;הפחתת תנועה&quot; של מערכת ההפעלה.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-serif text-xl text-ink">נתקלתם בבעיה?</h2>
        <p className="text-ink">
          אם נתקלתם בקושי בשימוש באתר, או שיש לכם הצעה לשיפור, נשמח שתפנו אלינו ונטפל בכך בהקדם:
        </p>
        <ul className="flex flex-col gap-2 text-ink">
          <li>
            טלפון:{" "}
            <a href={siteConfig.phoneHref} dir="ltr" className="underline underline-offset-2 hover:text-green-700">
              {siteConfig.phone}
            </a>
          </li>
          <li>
            אימייל:{" "}
            <a href={`mailto:${siteConfig.email}`} dir="ltr" className="underline underline-offset-2 hover:text-green-700">
              {siteConfig.email}
            </a>
          </li>
        </ul>
      </section>

      <p className="text-sm text-ink-muted">עודכן לאחרונה: 19.10.2026</p>
    </div>
  );
}
