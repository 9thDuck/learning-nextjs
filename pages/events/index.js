import Image from "next/image";
import { v4 as uuid } from "uuid";
import Link from "next/link";

export const getStaticProps = async () => {
 const { eventsCategories } = await import("../../data/data.json");
 return { props: { data: eventsCategories } };
};

const EventsPage = ({ data }) => {
 return (
  <>
   <h1>Events Page</h1>
   <div>
    {data.map((ev) => (
     <Link href={`/events/${ev.id}`} key={uuid()} passHref legacyBehavior>
      <a>
       <Image width={300} height={300} src={ev.image} alt={ev.title} />
       <h2>{ev.title}</h2>
      </a>
     </Link>
    ))}
   </div>
  </>
 );
};

export default EventsPage;
