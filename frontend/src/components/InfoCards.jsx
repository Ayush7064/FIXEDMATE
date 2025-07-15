import React from 'react';
import CardInfo from './CardInfo';
import { Search, Calendar, Check } from 'lucide-react';

const cardData = [
  {
    icon: <Search size={24} />,
    title: "Find the right provider",
    description: "Browse profiles, read reviews, and compare quotes from qualified professionals."
  },
  {
    icon: <Calendar size={24} />,
    title: "Schedule with ease",
    description: "Book appointments directly through the app, at a time that suits you."
  },
  {
    icon: <Check size={24} />,
    title: "Get the job done",
    description: "Rest assured, your satisfaction is our priority. We ensure quality service every time."
  }
];

function InfoCards() {
  return (
    <div className="flex flex-wrap justify-center gap-6 mt-8">
      {cardData.map((card, idx) => (
        <div key={idx} className="w-[410px] h-[200px]">
          <CardInfo
            icon={card.icon}
            title={card.title}
            description={card.description}
          />
        </div>
      ))}
    </div>
  );
}


export default InfoCards;
