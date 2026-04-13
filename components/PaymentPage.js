"use client";

import React, {useState, useEffect} from "react";
import Script from "next/script";
import { useSession,  } from "next-auth/react";
import { fetchUser, fetchpayments, initiate } from "@/actions/useraction";

const PaymentPage = ({ username }) => {
  const [paymentform, setpaymentform] = useState({ name: "",
  message: "",
  amount: "" });
  const [currentUser, setcurrentUser] = useState({})
  const [payments, setPayments] = useState([])
  useEffect (() =>{
    getData()
  }, [])
  const handleChange = (e) => {
    setpaymentform({ ...paymentform, [e.target.name]: e.target.value });
  };
  const getData= async (params)=>{
    let u = fetchUser(username)
    setcurrentUser(u)
    let dbpayments = await fetchpayments(username)
    setPayments(dbpayments)
  }
  const pay = async (amount) => {
    let a = await initiate(amount, username, paymentform);
    let orderId = a.id;
    var options = {
      key: process.env.NEXT_PUBLIC_KEY_ID, // Enter the Key ID generated from the Dashboard
      amount: amount, // Amount is in currency subunits.
      currency: "INR",
      name: "Getmeachai", //your business name
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: orderId, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
        name: "Gaurav Kumar", //your customer's name
        email: "gaurav.kumar@example.com",
        contact: "+919876543210", //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new Razorpay(options);

    rzp1.open();
  };
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

      <div className="cover w-full bg-red-50 relative">
        <img
          className="object-cover w-full h-[350]"
          src=" https://c10.patreonusercontent.com/4/patreon-media/p/campaign/4842667/452146dcfeb04f38853368f554aadde1/eyJ3IjoxOTIwLCJ3ZSI6MX0%3D/18.gif?token-hash=Mh-B5X0fAjX72C_3Ggf-nQMUUe4b4Os4Y0qll01wqq4%3D&token-time=1756944000"
          alt=""
        />
        <div className="absolute -bottom-20 right-[45%] rounded-full border-2 border-white">
          <img
            className="rounded-full"
            width={150}
            height={150}
            src="https://c10.patreonusercontent.com/4/patreon-media/p/campaign/4842667/aa52624d1cef47ba91c357da4a7859cf/eyJoIjozNjAsInciOjM2MH0%3D/4.gif?token-hash=ECF4bKmYuFozu-WpZiwgsfzPvB9_2L4HQhOqgpwukiM%3D&token-time=1757721600"
            alt=""
          />
        </div>
      </div>
      <div className="info flex justify-center items-center my-24 flex-col gap-2 mb-32">
        <div className="font-bold text-lg">@{username}</div>
        <div className="text-slate-400">Creating Animated art for VTT's</div>
        <div className="text-slate-400">
          10,000 members, 82 posts, 458 /release
        </div>
        <div className="payment flex gap-3 w-[80%] mt-11">
          <div className="supporters w-1/2 bg-slate-900 rounded-lg text-white p-10">
            {/* Show list of all supporters as a leaderboard */}
            <h2 className="text-2xl font-bold my-5">Supporters</h2>
            <ul className="mx-5">
              {payments.map((p, i) => {
                return  <li key={i} className="my-2 flex gap-2 items-center">
                <img
                  width={33}
                  className="bg-white border rounded-full"
                  src="profile.png"
                  alt="user avatar"
                />
                <span>
                  {p.name} donated <span className="font-bold">{p.amount}</span> with a
                  message "{p.message} "
                </span>
              </li>
})}
             
              
            </ul>
          </div>
          <div className="makePayment w-1/2 bg-slate-900 rounded-lg text-white p-10">
            <h2 className="text-2xl font-bold my-5 ">Make a payment</h2>
            <div className="flex gap-2 flex-col">
              <input
                onChange={handleChange}
                value={paymentform.name}
                name='name'
                type="text"
                className="w-full p-3 rounded-lg bg-slate-800 "
                placeholder="Enter Name"
              />
              <input
                onChange={handleChange}
                value={paymentform.message}
                name='message'
                type="text"
                className="w-full p-3 rounded-lg bg-slate-800 "
                placeholder="Enter Message"
              />
              <input
                onChange={handleChange}
                value={paymentform.amount}
                name='amount'
                type="text"
                className="w-full p-3 rounded-lg bg-slate-800 "
                placeholder="Enter Amount"
              />

              <button
                type="button"
                className=" w-fit text-white bg-gradient-to-br from-black to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Pay
              </button>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                className="bg-slate-800 p-3 rounded-lg"
                onClick={() => pay(1000)}
              >
                Pay ₹10
              </button>
              <button
                className="bg-slate-800 p-3 rounded-lg"
                onClick={() => pay(2000)}
              >
                Pay ₹20
              </button>
              <button
                className="bg-slate-800 p-3 rounded-lg"
                onClick={() => pay(3000)}
              >
                Pay ₹30
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
