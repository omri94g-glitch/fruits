const faqs = [
  {
    q: "מתי המגש מוכן?",
    a: "אנו מכינים כל מגש טרי ביום המשלוח עצמו, כדי להבטיח את המרב מבחינת טריות.",
  },
  {
    q: "האם התשלום מאובטח?",
    a: "כן, כל התשלומים מתבצעים בצורה מאובטחת בעמוד סליקה מוצפן.",
  },
  {
    q: "אפשר לבחור תאריך משלוח?",
    a: "בהחלט - בעת ההזמנה ניתן לבחור את תאריך המשלוח המועדף עליכם.",
  },
  {
    q: "אפשר להוסיף ברכה אישית?",
    a: "כן, בעת ההזמנה יש שדה להוספת ברכה אישית שתצורף למגש.",
  },
  {
    q: "מה המדיניות לגבי שינויים בהזמנה?",
    a: "צרו איתנו קשר בהקדם האפשרי בטלפון או בוואטסאפ ונשמח לסייע בכל שינוי.",
  },
  {
    q: "לאילו אזורים אתם מספקים?",
    a: "אנו מספקים לנתניה והסביבה (דמי משלוח 40 ₪) ולאזור המרכז, ממודיעין ועד השרון (דמי משלוח 60 ₪). לעיר שלא מופיעה ברשימה בעגלה צרו קשר ונבדוק אם אפשר להגיע.",
  },
];

export function FAQ() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h2 className="font-serif text-2xl md:text-3xl text-ink text-center mb-8">שאלות נפוצות</h2>

      <div className="flex flex-col gap-3">
        {faqs.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border border-line px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex items-center justify-between gap-4 cursor-pointer text-sm font-medium text-ink list-none">
              {item.q}
              <span aria-hidden="true" className="text-ink-muted group-open:rotate-45 transition-transform text-lg leading-none">
                +
              </span>
            </summary>
            <p className="text-sm text-ink-muted mt-3">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
