import React from "react";
import ServiceCard from "./ServiceCard";
import { services } from "../serviceData"; // Your services array

function PopularServicesSection() {
  return (
    <div className="w-full"> {/* Use your background color */}
      <div className="grid grid-cols-2  mt-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7  px-0">
        {services.map((service, idx) => (
          <ServiceCard key={idx} name={service.name} image={service.image} />
        ))}
      </div>
    </div>
  );
}

export default PopularServicesSection;
