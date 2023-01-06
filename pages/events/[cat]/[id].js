import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export const getStaticPaths = async () => {
 const { allEvents } = await import("../../../data/data.json");
 const paths = allEvents.map((path) => {
  return {
   params: { id: path.id, cat: path.city },
  };
 });
 return { paths, fallback: false };
};

export const getStaticProps = async (context) => {
 const { allEvents } = await import("../../../data/data.json");
 const { id } = context.params;
 const eventData = allEvents.find((ev) => ev.id === id);
 return { props: { eventData } };
};

const SingleEventPage = ({ eventData }) => {
 const [email, setEmail] = useState("");
 const [msg, setMsg] = useState("");
 const router = useRouter();

 const onSubmit = async (e) => {
  e.preventDefault();
  const eventId = router?.query.id;
  const validEmailRegex =
   /^[a-zA-Z0-9. !#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!email.match(validEmailRegex)) {
   setMsg("Please enter a correct email address.");
  }
  try {
   const response = await fetch("/api/email-registration", {
    method: "POST",
    "Content-Type": "application/json",
    body: JSON.stringify({ email, eventId }),
   });
   if (!response.ok) throw new Error(`Error: ${response.status} status.`);
   const data = await response.json();
  } catch (error) {
   console.log("ERROR", error);
  }
 };

 return (
  <div className="event-single-page">
   <Image
    src={eventData.image}
    width={1000}
    height={500}
    alt={eventData.title}
   />
   <h1>{eventData?.title}</h1>
   <p> {eventData.description}</p>
   <form onSubmit={onSubmit} className="email-registration">
    <label htmlFor="email">Get Registered for the event</label>
    <input
     type="text"
     name="email"
     id="email"
     value={email}
     onChange={(e) => setEmail(e.target.value)}
     placeholder="Please insert your email here"
    />
    <button type="submit">Submit</button>
    <p>{msg}</p>
   </form>
  </div>
 );
};

export default SingleEventPage;
