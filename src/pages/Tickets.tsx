export default function Tickets() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tickets</h1>

      <div className="bg-white rounded-2xl shadow p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Cliente</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t">
              <td className="p-3">#001</td>
              <td className="p-3">João</td>
              <td className="p-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Aberto</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
