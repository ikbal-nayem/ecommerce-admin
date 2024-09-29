import { generateDateFormat } from "utils/splitDate";

const OrderTrack = ({ orderTrack }) => {
  return (
    <div className="wx__card wx__mt-3 wx__p-3">
      <h6 className="wx__text_h6 wx__text_semibold">Track</h6>
      <div className="wx__timeline">
        <div className="events">
          {orderTrack?.map((event, indx) => (
            <div className="event" key={indx}>
              <div className="dot parent-dot" />
              <div className="wx__text_body wx__text_medium">
                {event?.status} <br />
                <small className="wx__text_regular wx__text_small wx__text-muted">
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
