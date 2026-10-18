// Agenda list: a short date block, title, optional note and tag.
export default function EventCalendar({items = [], dark = false, className = ""}) {
  return (
    <div className={["mkt mkt-cal", className].join(" ")} data-dark={dark ? "true" : "false"}>
      {items.map((item, i) => (
        <div key={i} className="mkt-cal-row" data-note={item.note ? "yes" : "no"}>
          <span className="mkt-cal-date">{item.date}</span>
          <div className="mkt-cal-body">
            <p className="mkt-cal-title">{item.title}</p>
            {item.note ? <p className="mkt-cal-note">{item.note}</p> : null}
          </div>
          {item.tag ? <span className="mkt-pill">{item.tag}</span> : null}
        </div>
      ))}
    </div>
  );
}
