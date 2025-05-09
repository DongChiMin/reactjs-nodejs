import ReservationForm from "../components/ReservationForm";

function Reservation() {
  return (
    <>
      <div className="section">
        <h2 className="text-center">Reservation Test </h2>
        <div className="row">
          <div className="col-8">
            <ReservationForm />
          </div>
        </div>
      </div>
    </>
  );
}

export default Reservation;
