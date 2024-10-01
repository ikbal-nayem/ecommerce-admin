import { generateDateFormat } from "utils/splitDate";

const OrderTrack = ({ orderTrack }) => {
  return (
    <div className="card mt-3 p-3">
      <h6 className="text_h6 text_semibold">Track</h6>
      <div className="wx__timeline">
        <div className="events">
          {orderTrack?.map((event, indx) => (
            <div className="event" key={indx}>
              <div className="dot parent-dot" />
              <div className="text_body text_medium">
                {event?.status} <br />
                <small className="text_regular text_small text-muted">
                  {generateDateFormat(
                    event?.time,
                    "%date%-%MM%-%yyyy% %hour%:%minute%"
                  )}
                </small>
              </div>
            </div>
          ))}
          <div className="line" />
        </div>
      </div>
    </div>
  );
};

export default OrderTrack;
