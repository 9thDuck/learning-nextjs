import Image from "next/image";
import Link from "next/link";
import { v4 as uuid } from "uuid";

export const getStaticPaths = async () => {
 const { eventsCategories } = await import("../../../data/data.json");
 const paths = eventsCategories.map((ev) => {
  return { params: { cat: ev.id.toString() } };
 });
 return { paths, fallback: false };
};

export const getStaticProps = async (context) => {
 const id = context?.params.cat;
 const { allEvents } = await import("../../../data/data.json");
 const data = allEvents.filter((ev) => ev.city === id);
 return { props: { data, pageName: id } };
};

const EventsCategoryPage = ({ data, pageName }) => {
 return (
  <>
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
      <a>
       <Image src={ev.image} width={300} height={300} alt={ev.title} />
       <h2>{ev.tittle}</h2>
       <p>{ev.description}</p>
      </a>
     </Link>
    );
   })}
  </>
 );
};

export default EventsCategoryPage;
