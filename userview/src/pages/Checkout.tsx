import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Truck, CreditCard, ShieldCheck, ChevronRight, Lock } from "lucide-react";
import api from "../api/axios";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("online");

  const [phone, setPhone] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    setIsProcessing(true);

    const orderData = {
      customer_name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      total_amount: cartTotal,
      payment_method: paymentMethod,
      payment_status: "Pending",
      order_status: "Processing",
      items: cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    if (paymentMethod === "cod") {
      try {
        const response = await api.post("/orders/place-order", orderData);
        if (response.data) {
          clearCart();
          setIsSuccess(true);
        }
      } catch (error) {
        console.error("Checkout error:", error);
        alert("Checkout failed. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    } else {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay failed to load. Are you online?");
        setIsProcessing(false);
        return;
      }

      try {
        // 1. Create the Order on your Backend
        const { data: razorpayOrder } = await api.post("/orders/create-razorpay-order", {
          amount: cartTotal,
        });

        // 2. Initialize Razorpay with your HARDCODED Key
        const options = {
          key: "rzp_test_SlcOJKQF8BYU5c", // Updated from image_03451d.jpg fix
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Luxuria Jewelers",
          description: "Premium Jewelry Purchase",
          order_id: razorpayOrder.id,
          handler: async function (response: any) { 
            try {
              const verifyData = {
                ...orderData,
                payment_status: "Paid",
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
              };
              
              await api.post("/orders/place-order", verifyData);
              clearCart();
              setIsSuccess(true);
            } catch (err) {
              alert("Payment captured, but order saving failed. Contact support.");
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: phone,
          },
          theme: {
            color: "#D4AF37",
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false); // Reset button if user closes window
            }
          }
        };

        const paymentObject = new (window as any).Razorpay(options); 
        
        paymentObject.on('payment.failed', function (response: any){ 
           alert("Payment failed: " + response.error.description);
           setIsProcessing(false);
        });
        
        paymentObject.open();

      } catch (error: any) {
        console.error("Razorpay Error:", error);
        alert("Configuration Error: " + (error.response?.data?.error || "Check backend connection"));
        setIsProcessing(false);
      }
    }
  };

  const inputClass = "w-full bg-slate-50/50 border border-gray-200 rounded-lg px-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/15 focus:border-[#D4AF37] transition-all duration-300";

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-[#FCFBF8]">
        <div className="w-24 h-24 bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] text-white rounded-full flex items-center justify-center mb-8 shadow-xl shadow-[#D4AF37]/20 transform hover:scale-105 transition-transform duration-500">
          <ShieldCheck size={48} strokeWidth={1.5} />
        </div>
        <h1 className="text-5xl font-serif mb-4 tracking-tight !text-black" style={{ color: "#000000" }}>Order Confirmed</h1>
        <p className="text-gray-500 mb-10 max-w-md text-lg leading-relaxed">
          Your exquisite selection is being prepared. A receipt has been sent to <span className="font-medium !text-black" style={{ color: "#000000" }}>{formData.email}</span>.
        </p>
        <Link to="/shop" className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
          Return to Boutique <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FCFBF8] min-h-screen pb-24 font-sans text-gray-800">
      <div className="pt-16 pb-8 text-center px-4">
        <div className="inline-flex items-center justify-center space-x-2 text-sm font-medium tracking-widest text-[#D4AF37] uppercase mb-4">
          <Lock size={14} /> <span>Secure SSL Checkout</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight !text-black" style={{ color: "#000000" }}>Complete Your Order</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 xl:grid-cols-12 gap-x-12 gap-y-10">
        <div className="xl:col-span-7">
          <form onSubmit={handleCheckout} className="space-y-10">
            <section className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <h2 className="text-2xl font-serif mb-6 flex items-center gap-4 !text-black" style={{ color: "#000000" }}>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-bold">1</span>
                Contact Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input required name="email" type="email" placeholder="Email Address" onChange={handleChange} className={inputClass} />
                <input required type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
              </div>
            </section>

            <section className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <h2 className="text-2xl font-serif mb-6 flex items-center gap-4 !text-black" style={{ color: "#000000" }}>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-bold">2</span>
                Shipping Address
              </h2>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input required name="firstName" placeholder="First Name" onChange={handleChange} className={inputClass} />
                  <input required name="lastName" placeholder="Last Name" onChange={handleChange} className={inputClass} />
                </div>
                <input required name="address" placeholder="Street Address" onChange={handleChange} className={inputClass} />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  <input required name="city" placeholder="City" onChange={handleChange} className={inputClass} />
                  <input required name="state" placeholder="State" onChange={handleChange} className={inputClass} />
                  <input required name="pincode" placeholder="Pincode" onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </section>

            <section className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <h2 className="text-2xl font-serif mb-6 flex items-center gap-4 !text-black" style={{ color: "#000000" }}>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-bold">3</span>
                Payment Method
              </h2>
              <div className="space-y-4">
                <label onClick={() => setPaymentMethod("online")} className={`group flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${paymentMethod === "online" ? "border-[#D4AF37] bg-[#D4AF37]/5 shadow-sm" : "border-gray-100 hover:border-gray-200 bg-white"}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "online" ? "border-[#D4AF37]" : "border-gray-300 group-hover:border-[#D4AF37]"}`}>{paymentMethod === "online" && <div className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full" />}</div>
                    <div><span className="block text-base font-medium !text-black" style={{ color: "#000000" }}>Pay Online Securely</span><span className="block text-sm text-gray-500 mt-0.5">UPI, Cards, NetBanking</span></div>
                  </div>
                  <CreditCard className={paymentMethod === "online" ? "text-[#D4AF37]" : "text-gray-400"} size={24} />
                </label>

                <label onClick={() => setPaymentMethod("cod")} className={`group flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${paymentMethod === "cod" ? "border-[#D4AF37] bg-[#D4AF37]/5 shadow-sm" : "border-gray-100 hover:border-gray-200 bg-white"}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cod" ? "border-[#D4AF37]" : "border-gray-300 group-hover:border-[#D4AF37]"}`}>{paymentMethod === "cod" && <div className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full" />}</div>
                    <div><span className="block text-base font-medium !text-black" style={{ color: "#000000" }}>Cash on Delivery</span><span className="block text-sm text-gray-500 mt-0.5">Pay when your order arrives</span></div>
                  </div>
                  <Truck className={paymentMethod === "cod" ? "text-[#D4AF37]" : "text-gray-400"} size={24} />
                </label>
              </div>
            </section>

            <button disabled={isProcessing || cart.length === 0} className="w-full xl:hidden bg-gray-900 text-white py-4.5 rounded-2xl font-medium text-lg">
              {isProcessing ? "Processing..." : `Place Order • ₹${cartTotal.toLocaleString('en-IN')}`}
            </button>
          </form>
        </div>

        <div className="xl:col-span-5 relative">
          <div className="sticky top-12 bg-white p-8 md:p-10 rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-gray-100">
            <h2 className="text-2xl font-serif mb-8 !text-black" style={{ color: "#000000" }}>Order Summary</h2>
            <div className="space-y-6 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center group">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-[#FCFBF8] rounded-xl border border-[#D4AF37]/30 flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
                      {((item as any).image || (item as any).imageUrl) ? (
                        <img 
  src={
  ((item as any).image || (item as any).imageUrl)?.startsWith("http") 
    ? ((item as any).image || (item as any).imageUrl) 
    : `https://devatesting.rakvihorganic.com${((item as any).image || (item as any).imageUrl)}`
}
  alt={item.name} 
  className="w-full h-full object-cover" 
/>
                      ) : (
                        <span className="text-2xl font-serif text-[#D4AF37] opacity-60 uppercase">{item.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-base font-medium !text-black" style={{ color: "#000000" }}>{item.name}</p>
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-base font-medium !text-black" style={{ color: "#000000" }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="my-8 border-t border-dashed border-gray-200" />
            <div className="space-y-4 text-base text-gray-600">
              <div className="flex justify-between"><span>Subtotal</span><span className="font-medium !text-black" style={{ color: "#000000" }}>₹{cartTotal.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span>Insured Shipping</span><span className="font-medium text-[#D4AF37]">Complimentary</span></div>
            </div>

            <div className="my-8 border-t border-gray-200" />
            <div className="flex justify-between items-end mb-10">
              <div><span className="block text-sm text-gray-500 mb-1">Total Due</span><span className="text-sm text-gray-400">(Includes all taxes)</span></div>
              <span className="text-4xl font-serif tracking-tight !text-black" style={{ color: "#000000" }}>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>

            <button disabled={isProcessing || cart.length === 0} onClick={handleCheckout} className="hidden xl:flex w-full bg-gray-900 text-white py-5 rounded-2xl font-medium text-lg justify-center items-center gap-3 hover:bg-black transition-all">
              {isProcessing ? "Authorizing Payment..." : <><Lock size={18} /> Place Order Securely</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}