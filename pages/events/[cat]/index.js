import EventCard from "../../../src/components/events/event-card";

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

const EventsCategoryPage = (props) => <EventCard {...props} />;

export default EventsCategoryPage;
