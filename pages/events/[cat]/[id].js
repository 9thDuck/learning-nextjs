import { useState, useEffect } from "react";
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

 useEffect(() => {
  let timeout = null;
  if (msg?.length) {
   timeout = setTimeout(() => {
    setMsg("");
    timeout = null;
   }, 3000);
  }

  return () => {
   if (timeout) {
    clearTimeout(timeout);
   }
  };
 }, [msg]);

 const onSubmit = async (e) => {
  e.preventDefault();
  const eventId = router?.query.id;
  const validEmailRegex =
   /^[a-zA-Z0-9. !#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!email.match(validEmailRegex)) {
   setMsg((msg) => {
    setTimeout(() => setMsg(""), 5000);
    return "Please enter a correct email address.";
   });
   return;
  }
  try {
   const response = await fetch("/api/email-registration", {
    method: "POST",
    "Content-Type": "application/json",
    body: JSON.stringify({ email, eventId }),
   });
   const data = await response.json();
   // if (!response.ok) throw new Error({ data });
   const { msg } = data;
   setMsg((prevState) => {
    setTimeout(() => setMsg(""), 3000);
    return msg;
   });
  } catch (error) {
   const { msg } = error;

   // setMsg(msg);

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
