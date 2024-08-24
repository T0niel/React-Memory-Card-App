// eslint-disable-next-line react/prop-types
export default function Header({ content }) {
  return (
    <div className="text-center text-2xl p-2 m-0 border-b-4 italic bg-red-500 text-yellow-200 border-b-gray-900 font-semibold">
      <h1>{content}</h1>
    </div>
  );
}
