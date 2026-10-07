import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../services/orderService";
import "../css/payment.css";

const Checkout = () => {
  const { cartItems, subtotal, tax, deliveryFee, total, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Customer & Order Info
  const [customer, setCustomer] = useState({
    name: currentUser?.name || "Yoga Balaji",
    email: currentUser?.email || "yoga@gmail.com",
    phone: currentUser?.phone || "+91 9876543210",
    address: "Flat 402, Royal Palms, 100 Feet Road, Bangalore",
    tableNumber: "T-04",
    orderType: "DELIVERY", // DELIVERY or DINE_IN
    paymentMethod: "UPI" // CARD, UPI, COD
  });

  // Credit Card State
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardHolder: (currentUser?.name || "Yoga Balaji").toUpperCase(),
    cardExpiry: "",
    cardCvv: "",
    saveCard: true,
    showCvv: false
  });

  // UPI State
  const [upiMode, setUpiMode] = useState("QR"); // "QR" or "ID"
  const [qrGenerated, setQrGenerated] = useState(true);
  const [upiId, setUpiId] = useState("");
  const [upiVerified, setUpiVerified] = useState(false);
  const [upiVerificationMsg, setUpiVerificationMsg] = useState("");
  const [upiTransactionRef, setUpiTransactionRef] = useState("");
  const [qrCountdown, setQrCountdown] = useState(300); // 5 minutes timer
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Submission State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Countdown timer for UPI QR Code
  useEffect(() => {
    let timer;
    if (customer.paymentMethod === "UPI" && qrGenerated && qrCountdown > 0) {
      timer = setInterval(() => {
        setQrCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [customer.paymentMethod, qrGenerated, qrCountdown]);

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCustomerChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value
    });
  };

  // Card Brand Detection
  const getCardBrand = (num) => {
    const clean = num.replace(/\s+/g, "");
    if (/^4/.test(clean)) return "Visa";
    if (/^(5[1-5]|2[2-7])/.test(clean)) return "Mastercard";
    if (/^(60|65|81|82)/.test(clean)) return "RuPay";
    if (/^3[47]/.test(clean)) return "Amex";
    return "QuickDine SmartPay";
  };

  const getCardThemeClass = (num) => {
    const brand = getCardBrand(num);
    if (brand === "Visa") return "card-theme-visa";
    if (brand === "Mastercard") return "card-theme-mastercard";
    if (brand === "RuPay") return "card-theme-rupay";
    if (brand === "Amex") return "card-theme-amex";
    return "card-theme-default";
  };

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = rawVal.replace(/(.{4})/g, "$1 ").trim();
    setCardData((prev) => ({ ...prev, cardNumber: formatted }));
  };

  // Format Expiry (MM/YY)
  const handleCardExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length > 2) {
      val = val.slice(0, 2) + "/" + val.slice(2);
    }
    setCardData((prev) => ({ ...prev, cardExpiry: val }));
  };

  // Format CVV (3-4 digits)
  const handleCardCvvChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCardData((prev) => ({ ...prev, cardCvv: val }));
  };

  // Fill Quick Test Cards
  const fillTestCard = (type) => {
    if (type === "VISA") {
      setCardData({
        cardNumber: "4532 8192 1029 4821",
        cardHolder: (customer.name || "YOGA BALAJI").toUpperCase(),
        cardExpiry: "08/29",
        cardCvv: "824",
        saveCard: true,
        showCvv: false
      });
    } else if (type === "RUPAY") {
      setCardData({
        cardNumber: "6071 5200 4819 9012",
        cardHolder: (customer.name || "YOGA BALAJI").toUpperCase(),
        cardExpiry: "12/28",
        cardCvv: "715",
        saveCard: true,
        showCvv: false
      });
    } else if (type === "MC") {
      setCardData({
        cardNumber: "5200 8123 4567 8901",
        cardHolder: (customer.name || "YOGA BALAJI").toUpperCase(),
        cardExpiry: "05/27",
        cardCvv: "389",
        saveCard: true,
        showCvv: false
      });
    }
  };

  // Verify UPI ID
  const handleVerifyUpi = () => {
    if (!upiId || !upiId.includes("@")) {
      setUpiVerificationMsg("Please enter a valid UPI ID (e.g. user@okhdfcbank)");
      setUpiVerified(false);
      return;
    }
    const cleanId = upiId.trim();
    const bankSuffix = cleanId.split("@")[1].toUpperCase();
    const ref = "UPI-" + Math.floor(100000000000 + Math.random() * 900000000000);
    setUpiVerified(true);
    setUpiTransactionRef(ref);
    setUpiVerificationMsg(`Verified: ${customer.name || "Customer"} (${bankSuffix})`);
  };

  // Confirm / Simulate UPI QR Payment
  const handleVerifyQrPayment = () => {
    const ref = "UPI-QR-" + Math.floor(100000000000 + Math.random() * 900000000000);
    setUpiVerified(true);
    setUpiTransactionRef(ref);
    setUpiVerificationMsg(`Payment Confirmed via UPI QR! Ref: #${ref}`);
  };

  // Copy UPI ID to clipboard
  const handleCopyUpi = () => {
    navigator.clipboard.writeText("quickdine@upi");
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Handle Order Placement & Database Persistence
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      setError("Please fill in your name, email address, and phone number.");
      return;
    }

    if (customer.orderType === "DELIVERY" && !customer.address.trim()) {
      setError("Please specify your delivery address.");
      return;
    }

    if (customer.orderType === "DINE_IN" && !customer.tableNumber.trim()) {
      setError("Please select or enter your Dine-in Table Number.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty. Please add delicious meals before checkout.");
      return;
    }

    // Payment-specific validation
    let paymentDetail = customer.paymentMethod;
    if (customer.paymentMethod === "CARD") {
      const cleanNum = cardData.cardNumber.replace(/\s+/g, "");
      if (cleanNum.length < 15) {
        setError("Please enter a valid 16-digit Credit or Debit Card number.");
        return;
      }
      if (!cardData.cardExpiry || cardData.cardExpiry.length < 5) {
        setError("Please provide a valid card expiry date (MM/YY).");
        return;
      }
      if (!cardData.cardCvv || cardData.cardCvv.length < 3) {
        setError("Please enter a valid 3 or 4 digit CVV security code.");
        return;
      }
      const brand = getCardBrand(cardData.cardNumber);
      const last4 = cleanNum.slice(-4);
      paymentDetail = `CARD (${brand} •••• ${last4})`;
    } else if (customer.paymentMethod === "UPI") {
      if (upiMode === "ID" && !upiId.trim()) {
        setError("Please enter and verify your UPI ID / VPA before placing the order.");
        return;
      }
      if (upiMode === "QR") {
        paymentDetail = upiVerified
          ? `UPI (QR Scanned - Ref #${upiTransactionRef})`
          : `UPI (Dynamic QR Payment)`;
      } else {
        paymentDetail = `UPI (${upiId.trim()})`;
      }
    } else {
      paymentDetail = "COD (Cash on Delivery / Table Pay)";
    }

    setLoading(true);

    try {
      // Build order payload stored directly in MySQL database
      const orderPayload = {
        customerName: customer.name.trim(),
        customerEmail: customer.email.trim(),
        customerPhone: customer.phone.trim(),
        deliveryAddress:
          customer.orderType === "DELIVERY"
            ? customer.address.trim()
            : `Dine-in at Restaurant (${customer.tableNumber})`,
        tableNumber: customer.orderType === "DINE_IN" ? customer.tableNumber.trim() : "Delivery",
        orderType: customer.orderType,
        paymentMethod: paymentDetail,
        items: cartItems.map((item) => ({
          foodId: item.foodId || item.id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity)
        })),
        subtotal: Number(subtotal),
        tax: Number(tax),
        deliveryFee: Number(deliveryFee),
        total: Number(total)
      };

      // 1. Post to Spring Boot /api/orders (persists to MySQL orders & order_items)
      const createdOrder = await createOrder(orderPayload);

      // 2. Clear cart from database /api/cart?email=...
      await clearCart();

      // 3. Navigate to live Order Tracking page
      navigate(`/orders/${createdOrder.id}`);
    } catch (err) {
      console.error("Order placement failed:", err);
      setError("Failed to place order in database. Please verify connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // UPI deep link
  const upiDeepLink = `upi://pay?pa=quickdine@upi&pn=QuickDine%20Restaurant&am=${total.toFixed(
    2
  )}&cu=INR&tn=QuickDine%20Order`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    upiDeepLink
  )}&color=2f3542&bgcolor=ffffff`;

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="bg-white p-5 rounded-4 shadow-sm mx-auto" style={{ maxWidth: "480px" }}>
          <i className="bi bi-cart-x text-danger display-2 mb-3 d-block"></i>
          <h4 className="fw-bold mb-2">No Items In Cart</h4>
          <p className="text-muted mb-4">Please add dishes from our menu before checking out.</p>
          <Link to="/menu" className="btn btn-primary-qd px-4">
            <i className="bi bi-menu-app me-2"></i> Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Breadcrumb & Header */}
        <div className="mb-4">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-2">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none text-muted">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/cart" className="text-decoration-none text-muted">Cart</Link>
              </li>
              <li className="breadcrumb-item active text-danger fw-semibold" aria-current="page">
                Payment & Checkout
              </li>
            </ol>
          </nav>
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold mb-1">Finalize Order & Payment</h2>
              <p className="text-muted small mb-0">
                Direct database checkout with instant UPI QR & secure Credit/Debit card options
              </p>
            </div>
            <div className="mt-2 mt-md-0">
              <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill">
                <i className="bi bi-shield-lock-fill me-1"></i> 256-Bit SSL Encrypted
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger py-3 px-4 rounded-4 shadow-sm mb-4 d-flex align-items-center gap-3">
            <i className="bi bi-exclamation-triangle-fill fs-4 flex-shrink-0 text-danger"></i>
            <div>
              <strong className="d-block">Checkout Notice</strong>
              <span className="small">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="row g-4">
            {/* Left Column: Form Details & Payment Gateway */}
            <div className="col-lg-7">
              {/* 1. Dining Preference */}
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="badge bg-danger rounded-circle p-2 px-3 fw-bold">1</span>
                  <h5 className="fw-bold mb-0">Dining Preference</h5>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div
                      className={`payment-option-card h-100 ${
                        customer.orderType === "DELIVERY" ? "selected" : ""
                      }`}
                      onClick={() => setCustomer({ ...customer, orderType: "DELIVERY" })}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className="payment-option-icon">
                          <i className="bi bi-bicycle"></i>
                        </div>
                        <div>
                          <span className="fw-bold d-block text-dark">Doorstep Delivery</span>
                          <small className="text-muted">Delivered piping hot to your location</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div
                      className={`payment-option-card h-100 ${
                        customer.orderType === "DINE_IN" ? "selected" : ""
                      }`}
                      onClick={() => setCustomer({ ...customer, orderType: "DINE_IN" })}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className="payment-option-icon">
                          <i className="bi bi-cup-hot"></i>
                        </div>
                        <div>
                          <span className="fw-bold d-block text-dark">Dine-in Table</span>
                          <small className="text-muted">Served directly at your restaurant table</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Customer Information */}
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="badge bg-danger rounded-circle p-2 px-3 fw-bold">2</span>
                  <h5 className="fw-bold mb-0">Customer Information</h5>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Full Name *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-person text-muted"></i>
                      </span>
                      <input
                        type="text"
                        name="name"
                        value={customer.name}
                        onChange={handleCustomerChange}
                        className="form-control border-start-0"
                        placeholder="Yoga Balaji"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Email Address (for Receipt) *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={customer.email}
                        onChange={handleCustomerChange}
                        className="form-control border-start-0"
                        placeholder="yoga@gmail.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Phone Number *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-telephone text-muted"></i>
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={customer.phone}
                        onChange={handleCustomerChange}
                        className="form-control border-start-0"
                        placeholder="+91 9876543210"
                        required
                      />
                    </div>
                  </div>

                  {customer.orderType === "DINE_IN" ? (
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Table Number *</label>
                      <select
                        name="tableNumber"
                        value={customer.tableNumber}
                        onChange={handleCustomerChange}
                        className="form-select"
                        required
                      >
                        <option value="T-01">Table T-01 (2 Seater)</option>
                        <option value="T-02">Table T-02 (4 Seater)</option>
                        <option value="T-03">Table T-03 (4 Seater)</option>
                        <option value="T-04">Table T-04 (6 Seater VIP)</option>
                        <option value="T-05">Table T-05 (8 Seater Family)</option>
                        <option value="T-06">Table T-06 (2 Seater Patio)</option>
                      </select>
                    </div>
                  ) : (
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-muted">Delivery Address *</label>
                      <textarea
                        name="address"
                        value={customer.address}
                        onChange={handleCustomerChange}
                        className="form-control"
                        rows="2"
                        placeholder="House / Flat No, Building Name, Street, Landmark, Bangalore"
                        required
                      ></textarea>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Payment Method & Interactive Payment Gateway */}
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-danger rounded-circle p-2 px-3 fw-bold">3</span>
                    <h5 className="fw-bold mb-0">Select Payment Method</h5>
                  </div>
                  <span className="badge bg-light text-muted border">
                    Amount: ₹{total.toFixed(2)}
                  </span>
                </div>

                {/* Payment Option Selector Cards */}
                <div className="row g-3 mb-4">
                  {/* Option 1: Instant UPI & QR */}
                  <div className="col-md-4">
                    <div
                      className={`payment-option-card h-100 ${
                        customer.paymentMethod === "UPI" ? "selected" : ""
                      }`}
                      onClick={() => setCustomer({ ...customer, paymentMethod: "UPI" })}
                    >
                      <div className="d-flex flex-column align-items-center text-center p-1">
                        <div className="payment-option-icon mb-2">
                          <i className="bi bi-qr-code-scan"></i>
                        </div>
                        <span className="fw-bold text-dark fs-6">Instant UPI & QR</span>
                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                          GPay, PhonePe, Paytm
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Credit / Debit Card */}
                  <div className="col-md-4">
                    <div
                      className={`payment-option-card h-100 ${
                        customer.paymentMethod === "CARD" ? "selected" : ""
                      }`}
                      onClick={() => setCustomer({ ...customer, paymentMethod: "CARD" })}
                    >
                      <div className="d-flex flex-column align-items-center text-center p-1">
                        <div className="payment-option-icon mb-2">
                          <i className="bi bi-credit-card-2-front"></i>
                        </div>
                        <span className="fw-bold text-dark fs-6">Credit / Debit Card</span>
                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                          Visa, Mastercard, RuPay
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Option 3: COD / Pay at Table */}
                  <div className="col-md-4">
                    <div
                      className={`payment-option-card h-100 ${
                        customer.paymentMethod === "COD" ? "selected" : ""
                      }`}
                      onClick={() => setCustomer({ ...customer, paymentMethod: "COD" })}
                    >
                      <div className="d-flex flex-column align-items-center text-center p-1">
                        <div className="payment-option-icon mb-2">
                          <i className="bi bi-cash-stack"></i>
                        </div>
                        <span className="fw-bold text-dark fs-6">Pay On Delivery</span>
                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                          Cash or Card on Arrival
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* INTERACTIVE OPTION 1: UPI & DYNAMIC QR CODE GENERATOR         */}
                {/* ------------------------------------------------------------- */}
                {customer.paymentMethod === "UPI" && (
                  <div className="upi-panel bg-light rounded-4 p-4 border">
                    {/* Sub-tab Switcher: Scan QR vs Enter UPI ID */}
                    <div className="d-flex justify-content-center gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => setUpiMode("QR")}
                        className={`btn btn-sm rounded-pill px-4 fw-semibold ${
                          upiMode === "QR" ? "btn-dark shadow-sm" : "btn-outline-secondary"
                        }`}
                      >
                        <i className="bi bi-qr-code me-1"></i> Scan Dynamic QR Code
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpiMode("ID")}
                        className={`btn btn-sm rounded-pill px-4 fw-semibold ${
                          upiMode === "ID" ? "btn-dark shadow-sm" : "btn-outline-secondary"
                        }`}
                      >
                        <i className="bi bi-phone me-1"></i> Enter UPI ID (VPA)
                      </button>
                    </div>

                    {upiMode === "QR" ? (
                      /* Dynamic QR Generation View */
                      <div className="qr-card-container">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="badge bg-danger-subtle text-danger fw-bold px-3 py-1 rounded-pill">
                            <i className="bi bi-lightning-charge-fill me-1"></i> UPI 2.0 Fast Pay
                          </span>
                          <span className="small text-muted fw-semibold">
                            Expires in: <span className="text-danger fw-bold">{formatCountdown(qrCountdown)}</span>
                          </span>
                        </div>

                        {/* Scanner Box with QR Code */}
                        <div className="qr-scanner-box">
                          <span className="qr-scanner-corner qr-corner-tl"></span>
                          <span className="qr-scanner-corner qr-corner-tr"></span>
                          <span className="qr-scanner-corner qr-corner-bl"></span>
                          <span className="qr-scanner-corner qr-corner-br"></span>
                          <img
                            src={qrCodeUrl}
                            alt="QuickDine UPI Payment QR"
                            className="qr-image"
                          />
                        </div>

                        {/* Amount & Merchant Info */}
                        <div className="mb-3">
                          <h4 className="fw-bold text-dark mb-1">₹{total.toFixed(2)}</h4>
                          <span className="text-muted small d-block">Paying to: QuickDine Restaurant</span>
                          <div className="d-inline-flex align-items-center gap-2 mt-1 bg-white px-3 py-1 rounded-pill border">
                            <small className="font-monospace text-secondary fw-semibold">quickdine@upi</small>
                            <button
                              type="button"
                              onClick={handleCopyUpi}
                              className="btn btn-link btn-sm p-0 text-danger text-decoration-none"
                              title="Copy UPI ID"
                            >
                              {copiedUpi ? (
                                <i className="bi bi-check2 text-success fw-bold"> Copied</i>
                              ) : (
                                <i className="bi bi-copy"></i>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* UPI Apps Row */}
                        <div className="upi-apps-row mb-3">
                          <span className="upi-app-badge">
                            <i className="bi bi-google text-primary"></i> GPay
                          </span>
                          <span className="upi-app-badge">
                            <i className="bi bi-phone text-purple"></i> PhonePe
                          </span>
                          <span className="upi-app-badge">
                            <i className="bi bi-wallet2 text-info"></i> Paytm
                          </span>
                          <span className="upi-app-badge">
                            <i className="bi bi-bank text-danger"></i> BHIM
                          </span>
                        </div>

                        {/* Status / Verify Payment button */}
                        {upiVerified ? (
                          <div className="alert alert-success py-2 px-3 small rounded-3 mb-0 d-flex align-items-center justify-content-center gap-2">
                            <i className="bi bi-check-circle-fill text-success fs-5"></i>
                            <span className="fw-bold">{upiVerificationMsg || "Payment Verified via UPI QR!"}</span>
                          </div>
                        ) : (
                          <div>
                            <div className="d-flex align-items-center justify-content-center gap-2 text-muted small mb-3">
                              <span className="pulse-dot"></span>
                              <span>Scan with your UPI App & confirm ₹{total.toFixed(2)}</span>
                            </div>
                            <div className="d-flex gap-2 justify-content-center">
                              <button
                                type="button"
                                onClick={handleVerifyQrPayment}
                                className="btn btn-sm btn-success rounded-pill px-3 fw-bold"
                              >
                                <i className="bi bi-check-circle-fill me-1"></i> I Have Paid / Verify
                              </button>
                              <button
                                type="button"
                                onClick={() => setQrCountdown(300)}
                                className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                              >
                                <i className="bi bi-arrow-clockwise me-1"></i> Refresh QR
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Pay via UPI ID Input */
                      <div className="bg-white p-4 rounded-4 border">
                        <label className="form-label small fw-semibold text-muted">
                          Enter your UPI ID / Virtual Payment Address (VPA)
                        </label>
                        <div className="input-group mb-2">
                          <span className="input-group-text bg-light">
                            <i className="bi bi-at text-muted"></i>
                          </span>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value);
                              setUpiVerified(false);
                            }}
                            placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
                            className="form-control"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyUpi}
                            className="btn btn-outline-danger fw-semibold px-3"
                          >
                            Verify VPA
                          </button>
                        </div>

                        {/* Quick Test UPI IDs */}
                        <div className="d-flex flex-wrap align-items-center gap-2 mt-2 mb-3">
                          <small className="text-muted">Quick test VPAs:</small>
                          <span
                            className="quick-fill-chip"
                            onClick={() => {
                              setUpiId("yoga@okhdfcbank");
                              setUpiVerified(true);
                              setUpiTransactionRef("UPI-TEST-HDFC");
                              setUpiVerificationMsg("Verified: Yoga Balaji (HDFC Bank)");
                            }}
                          >
                            yoga@okhdfcbank
                          </span>
                          <span
                            className="quick-fill-chip"
                            onClick={() => {
                              setUpiId("balaji@ybl");
                              setUpiVerified(true);
                              setUpiTransactionRef("UPI-TEST-YBL");
                              setUpiVerificationMsg("Verified: Balaji (Yes Bank / PhonePe)");
                            }}
                          >
                            balaji@ybl
                          </span>
                        </div>

                        {upiVerified && (
                          <div className="alert alert-success py-2 px-3 small rounded-3 mb-0 d-flex align-items-center gap-2">
                            <i className="bi bi-check-circle-fill text-success fs-5"></i>
                            <span className="fw-bold">{upiVerificationMsg}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* INTERACTIVE OPTION 2: CREDIT / DEBIT CARD OPTION PAGE         */}
                {/* ------------------------------------------------------------- */}
                {customer.paymentMethod === "CARD" && (
                  <div className="card-payment-section bg-light rounded-4 p-4 border">
                    {/* Interactive Virtual Card Mockup */}
                    <div className="virtual-card-wrapper">
                      <div className={`virtual-card ${getCardThemeClass(cardData.cardNumber)}`}>
                        {/* Top Row: Chip, Contactless, Network */}
                        <div className="card-top-row">
                          <div className="d-flex align-items-center">
                            <div className="emv-chip"></div>
                            <i className="bi bi-wifi contactless-icon"></i>
                          </div>
                          <span className="card-network-badge">
                            {getCardBrand(cardData.cardNumber)}
                          </span>
                        </div>

                        {/* Middle: Card Number */}
                        <div className="card-number-display">
                          {cardData.cardNumber || "•••• •••• •••• ••••"}
                        </div>

                        {/* Bottom Row: Holder & Expiry */}
                        <div className="card-bottom-row">
                          <div>
                            <span className="card-label">Card Holder</span>
                            <div className="card-holder-display">
                              {cardData.cardHolder || "YOGA BALAJI"}
                            </div>
                          </div>
                          <div className="text-end">
                            <span className="card-label">Expires</span>
                            <div className="card-expiry-display">
                              {cardData.cardExpiry || "MM/YY"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Demo Fill Buttons */}
                    <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 mb-4">
                      <small className="text-muted fw-semibold">Quick Test Fill:</small>
                      <button
                        type="button"
                        onClick={() => fillTestCard("VISA")}
                        className="quick-fill-chip border-0 shadow-sm"
                      >
                        <i className="bi bi-credit-card me-1 text-primary"></i> Test Visa
                      </button>
                      <button
                        type="button"
                        onClick={() => fillTestCard("RUPAY")}
                        className="quick-fill-chip border-0 shadow-sm"
                      >
                        <i className="bi bi-credit-card me-1 text-success"></i> Test RuPay
                      </button>
                      <button
                        type="button"
                        onClick={() => fillTestCard("MC")}
                        className="quick-fill-chip border-0 shadow-sm"
                      >
                        <i className="bi bi-credit-card me-1 text-danger"></i> Test Mastercard
                      </button>
                    </div>

                    {/* Card Form Inputs */}
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small fw-semibold text-muted">Card Number *</label>
                        <div className="input-group">
                          <span className="input-group-text bg-white border-end-0">
                            <i className="bi bi-credit-card text-muted"></i>
                          </span>
                          <input
                            type="text"
                            value={cardData.cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="4532 8192 1029 4821"
                            maxLength="19"
                            className="form-control border-start-0 font-monospace"
                            required={customer.paymentMethod === "CARD"}
                          />
                          <span className="input-group-text bg-white text-muted fw-bold small">
                            {getCardBrand(cardData.cardNumber)}
                          </span>
                        </div>
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold text-muted">Cardholder Name *</label>
                        <input
                          type="text"
                          value={cardData.cardHolder}
                          onChange={(e) =>
                            setCardData({
                              ...cardData,
                              cardHolder: e.target.value.toUpperCase()
                            })
                          }
                          placeholder="YOGA BALAJI"
                          className="form-control text-uppercase"
                          required={customer.paymentMethod === "CARD"}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted">Valid Thru (MM/YY) *</label>
                        <input
                          type="text"
                          value={cardData.cardExpiry}
                          onChange={handleCardExpiryChange}
                          placeholder="MM/YY"
                          maxLength="5"
                          className="form-control font-monospace"
                          required={customer.paymentMethod === "CARD"}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted">CVV / CVC (3-4 digits) *</label>
                        <div className="input-group">
                          <input
                            type={cardData.showCvv ? "text" : "password"}
                            value={cardData.cardCvv}
                            onChange={handleCardCvvChange}
                            placeholder="•••"
                            maxLength="4"
                            className="form-control font-monospace"
                            required={customer.paymentMethod === "CARD"}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setCardData((prev) => ({ ...prev, showCvv: !prev.showCvv }))
                            }
                            className="btn btn-outline-secondary"
                            title="Toggle CVV visibility"
                          >
                            <i className={cardData.showCvv ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                          </button>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="saveCardCheck"
                            checked={cardData.saveCard}
                            onChange={(e) =>
                              setCardData({ ...cardData, saveCard: e.target.checked })
                            }
                          />
                          <label className="form-check-label small text-muted cursor-pointer" htmlFor="saveCardCheck">
                            Save card securely for 1-click checkout in future orders
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 pt-3 mt-3 border-top text-muted small">
                      <span><i className="bi bi-shield-check text-success me-1"></i> PCI-DSS Level 1</span>
                      <span><i className="bi bi-lock-fill text-primary me-1"></i> 256-Bit SSL Encryption</span>
                      <span><i className="bi bi-patch-check-fill text-danger me-1"></i> 3D Secure OTP</span>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* OPTION 3: CASH ON DELIVERY / PAY AT RESTAURANT TABLE          */}
                {/* ------------------------------------------------------------- */}
                {customer.paymentMethod === "COD" && (
                  <div className="bg-light rounded-4 p-4 border text-center">
                    <i className="bi bi-cash-coin display-4 text-warning mb-2 d-block"></i>
                    <h6 className="fw-bold text-dark mb-1">
                      {customer.orderType === "DINE_IN" ? "Pay at Table" : "Cash on Delivery"}
                    </h6>
                    <p className="text-muted small mb-0 mx-auto" style={{ maxWidth: "420px" }}>
                      {customer.orderType === "DINE_IN"
                        ? "You can pay comfortably with cash, UPI or card when our server presents the bill at your table."
                        : "Pay the exact amount ₹" +
                          total.toFixed(2) +
                          " to the delivery partner in cash or UPI upon meal arrival."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary & Place Order Button */}
            <div className="col-lg-5">
              <div
                className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top"
                style={{ top: "90px" }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <h5 className="fw-bold mb-0">Order Summary</h5>
                  <span className="badge bg-danger rounded-pill px-3 py-1">
                    {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
                  </span>
                </div>

                {/* Cart Items List From Database */}
                <div className="mb-3" style={{ maxHeight: "260px", overflowY: "auto" }}>
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="d-flex justify-content-between align-items-center py-2 border-bottom"
                    >
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={item.image || "/images/foods/default-food.jpg"}
                          alt={item.name}
                          className="rounded-2"
                          style={{ width: "42px", height: "42px", objectFit: "cover" }}
                        />
                        <div>
                          <span className="fw-semibold text-dark d-block small">{item.name}</span>
                          <small className="text-muted">
                            {item.quantity} × ₹{Number(item.price).toFixed(2)}
                          </small>
                        </div>
                      </div>
                      <span className="fw-bold text-dark small">
                        ₹{(Number(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Calculations */}
                <div className="d-flex justify-content-between mb-2 small">
                  <span className="text-muted">Items Subtotal</span>
                  <span className="fw-semibold">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="d-flex justify-content-between mb-2 small">
                  <span className="text-muted">GST Tax (5%)</span>
                  <span className="fw-semibold">₹{tax.toFixed(2)}</span>
                </div>

                <div className="d-flex justify-content-between mb-3 small">
                  <span className="text-muted">Packaging / Delivery</span>
                  <span className="fw-semibold">
                    {deliveryFee === 0 ? (
                      <span className="badge bg-success-subtle text-success">FREE</span>
                    ) : (
                      `₹${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                {/* Dining & Payment Info Pills */}
                <div className="p-3 bg-light rounded-3 mb-3 small">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Mode:</span>
                    <span className="fw-semibold text-dark">
                      {customer.orderType === "DELIVERY"
                        ? "Doorstep Delivery"
                        : `Dine-in (${customer.tableNumber})`}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Method:</span>
                    <span className="fw-semibold text-danger">
                      {customer.paymentMethod === "CARD"
                        ? "Credit/Debit Card"
                        : customer.paymentMethod === "UPI"
                        ? "Instant UPI / QR"
                        : "Cash on Delivery"}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="d-flex justify-content-between align-items-center pt-2 border-top mb-4">
                  <div>
                    <span className="fs-6 fw-bold text-dark d-block">Grand Total</span>
                    <small className="text-muted">Inclusive of all taxes</small>
                  </div>
                  <span className="fs-3 fw-bold text-danger">₹{total.toFixed(2)}</span>
                </div>

                {/* Place Order CTA Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary-qd btn-lg w-100 py-3 shadow"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Saving to Database...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-check me-2"></i> Place Order & Pay ₹
                      {total.toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
