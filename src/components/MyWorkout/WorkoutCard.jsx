import React from "react";

const WorkoutCard = ({ day, title, exercises,note }) => {
  return (
    <div className="p-4 rounded-2xl shadow-2xs bg-white border border-gray-400 hover:shadow-2xl transition-shadow duration-300">
    <h3 className="text-2xl font-extrabold text-gray-800 mb-3 tracking-wide">{title}</h3>
    <h4 className="text-lg  text-blue-600 font-bold mb-4">{day}</h4>
  
    <ul className="list-disc ml-6 space-y-2">
      {exercises.map((exercise, index) => (
        <li key={index} className="text-gray-800 text-base leading-relaxed">
          {exercise}
        </li>
      ))}
    </ul>
  
    <div className="mt-3">
      <p className="text-lg font-bold text-blue-700 mb-1">Note:</p>
      <p className="text-gray-700 text-base leading-snug">{note}</p>
    </div>
  </div>
  
  );
};

export default WorkoutCard;