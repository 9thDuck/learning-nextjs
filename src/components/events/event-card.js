import React from "react";
import Image from "next/image";
import Link from "next/link";
import { v4 as uuid } from "uuid";

const EventCard = ({ data, pageName }) => {
 return (
  <div className="cat-events">
   <h1>
    Events in{" "}
    {pageName?.[0]?.toUpperCase() + pageName?.slice(1, pageName?.length)}
   </h1>
   {data.map((ev) => {
    return (
     <Link
      key={uuid()}
      href={`/events/${ev.city}/${ev.id}`}
      passHref
      legacyBehavior
     >
      <a className="card">
       <Image src={ev.image} width={300} height={300} alt={ev.title} />
       <h2>{ev.tittle}</h2>
       <p>{ev.description}</p>
      </a>
     </Link>
    );
   })}
  </div>
 );
};

export default EventCard;
