import React from 'react'
import '../../Styles/Home.css'
import Hero from './Hero';
import Products from './Products';
import WhyChooseUs from './WhyChooseUs';
import Testimonials from './Testimonals';
import FAQs from './FAQs';
const UserHome = () => {
  return (
    <div style={{backgroundColor:"var(--background)"}}>
        <Hero />
        <Products />
        <WhyChooseUs />
        <Testimonials />
        <FAQs />

    </div>
  )
}
 
export default UserHome;
 
 