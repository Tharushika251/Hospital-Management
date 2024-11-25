import BillCard from './BillCard';

export default function BillHistory({ bill, navigate }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Paid Bill History</h2>
      <BillCard   bill={bill} navigate={navigate}  />
    </div>
  );
}
