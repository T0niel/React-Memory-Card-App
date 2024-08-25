// eslint-disable-next-line react/prop-types
export default function Score({ score, bestScore }) {
  return (
    <div className="bg-blue-400 text-white font-bold p-2 w-40 m-2">
      <p>score: {score}</p>
      <p>best score: {bestScore}</p>
    </div>
  );
}
