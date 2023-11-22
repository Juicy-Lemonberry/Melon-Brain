'use client'
import QuoteText from "@/components/QuoteText";
import TopNavbar from "@/components/TopNavbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <TopNavbar/>    
      <h3>Welp, theres nothing here for now . . .</h3>

      <p>Why dont you check out the <Link href={`/rent-map`} passHref><a className="rental-link">rental map view</a></Link> or the <Link href={`/forum`} passHref><a className="rental-link">forum</a></Link> page?</p>

      <QuoteText text="Maybe consider signing up or logging in, if you haven't done so yet!"></QuoteText>
    </>
  );
}
