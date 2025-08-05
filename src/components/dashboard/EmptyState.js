export default function EmptyState({ icon, title, action }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 text-center">
      <div className="mx-auto text-4xl text-gray-300 mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-500 mb-2">{title}</h3>
      {action && (
        <button className="text-teal-600 hover:text-teal-800 font-medium">
          {action}
        </button>
      )}
    </div>
  );
}
