const nodemailer = require("nodemailer");

const sendPlayerRegistrationInvoiceEmail = async (email, data) => {
  let mailRes = null;
  let transpoter = nodemailer.createTransport({
    service: "Gmail",
    port: 587,
    secure: false,
    auth: {
      user: "rakib.netmow@gmail.com",
      pass: "youbuagttebjsukh",
    },
  });
  let mailOption = {
    from: "Squaddeck",
    to: email,
    subject: "Player Registration Invoice.",
    html: `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
        <style>
        /* Additional styling for scrollable table on mobile */
        @media (max-width: 767px) {
          .scrollable-table {
            overflow-x: auto;
          }
          .header-nav {
            flex-direction: column;
        }
        .invoice-cover {
            flex-direction: column;
          }
        }
  
        body {
          font-family: sans-serif;
          background-color: #ffff;
        }
  
        .container {
          max-width: 100%;
          margin: auto;
          padding: 1rem;
        }
  
        /* Breadcrumb */
        nav {
          color: #718096;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }
  
        nav a {
          color: #3490dc;
          text-decoration: none;
        }
  
        nav a:hover {
          text-decoration: underline;
        }
  
        /* Invoice Card */
        .invoice-card {
          background-color: #fff;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border-radius: 6px;
          padding: 1rem;
          margin-bottom: 1rem;
        }
  
        /* Header */
        .header {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
  
        .logo {
          margin-bottom: 1rem;
        }
        .header-nav {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
  
        .billing-address {
          display: flex;
          flex-direction: column;
          width: 40%;
          justify-content: end;
          text-align: start;
          margin-bottom: 0.5rem;
        }
  
        /* Invoice Details */
        .invoice-details {
          margin-bottom: 0.5rem;
          margin-top: 1rem;
        }
        .invoice-cover {
          display: flex;
        }
        .invoice-cover div {
            margin: 0 1rem;
          }
        .invoice-details p {
          font-size: 0.875rem;
          margin-bottom: 0;
        }
  
        .invoice-details .font-semibold {
          font-weight: 600;
        }
  
        /* Table */
        .table-container {
          margin-bottom: 1rem;
        }
  
        .scrollable-table {
          overflow-x: auto;
        }
  
        table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #cbd5e0;
        }
  
        th,
        td {
          border: 1px solid #cbd5e0;
          padding: 0.5rem;
          text-align: center;
        }
  
        th {
          background-color: #edf2f7;
          font-size: 0.75rem;
        }
  
        td {
          font-size: 0.875rem;
        }
  
        /* Totals */
        .totals {
          border-top: 1px solid #cbd5e0;
          border-bottom: 1px solid #cbd5e0;
          padding: 1rem 0;
        }
  
        .total-particle {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: end;
          font-size: 0.875rem;
        }
  
        .totals .text-end {
          text-align: start;
        }
        .child-total {
          display: flex;
          width: 100%;
          justify-content: end;
        }
        </style>
        <title>Your Invoice</title>
      </head>
      <body class="font-sans bg-gray-100">
        <div class="container mx-auto p-4">    
          <div class="flex justify-center">
            <div class="w-full max-w-3xl">
              <!-- Invoice Card -->
              <div class="bg-white shadow-md rounded-md p-4 md:p-8 mb-8">
                <!-- Header -->
                <div
                class="header-nav"
                >
                  <!-- Logo goes here -->
                  <div class="mb-4 md:mb-0">
                    <!-- Replace with your logo -->
                    <img
                      src="https://res.cloudinary.com/dps9sq62u/image/upload/v1702457096/logo_tay1sg.png"
                      alt="Logo"
                      class="logo"
                    />
                    <p class="text-muted text-xs md:text-sm mb-1">
                      ${data?.address ? data?.address : "--"}, ${
      data?.zip ? " " + data?.zip : "--"
    }, ${data?.country ? data?.country : "--"}
                    </p>
                    <p class="text-muted text-xs md:text-sm mb-1">
                      ${data?.city ? data?.city : "--"}
                    </p>
                    <p class="text-muted text-xs md:text-sm mb-1">
                      ${data?.zip ? data?.zip : "--"}
                    </p>
                    <p class="text-muted text-xs md:text-sm mb-1">
                     ${data?.zip ? " " + data?.zip : "--"}
                    </p>
                  </div>
    
                  <!-- Billing Address -->
                  <div class="text-center md:text-right billing-address">
                    <h6
                      class="text-muted text-uppercase text-base md:text-xl font-semibold mb-2 md:mb-0"
                    >
                      Billing Address
                    </h6>
                    <p class="text-muted text-xs md:text-sm mb-1">
                      ${data?.name ? data?.name : "--"}
                    </p>
                    <p class="text-muted text-xs md:text-sm mb-1">
                      ${data?.email ? data?.email : "--"}
                    </p>
                    <p class="text-muted text-xs md:text-sm mb-1">
                      Phone: ${data?.phone ? data?.phone : "--"}
                    </p>
                  </div>
                </div>
    
                <!-- Invoice Details -->
                <div class="mb-5 invoice-details">
                  <div class="invoice-cover">
                    <div>
                      <p
                        class="text-muted text-xs md:text-sm mb-2 text-uppercase font-semibold"
                      >
                        Invoice No
                      </p>
                      <p class="text-xs md:text-sm mb-0">${data?.invoiceId}</p>
                    </div>
                    <div>
                      <p
                        class="text-muted text-xs md:text-sm mb-2 text-uppercase font-semibold"
                      >
                        Date
                      </p>
                      <p class="text-xs md:text-sm mb-0">${data?.date}</p>
                    </div>
                    <div>
                      <p
                        class="text-muted text-xs md:text-sm mb-2 text-uppercase font-semibold"
                      >
                        Payment Status
                      </p>
                      <p class="text-xs md:text-sm mb-0 text-success">
                        <span class="text-center"
                          >${data?.status ? data?.status : "--"}</span
                        >
                      </p>
                    </div>
                    <div>
                      <p
                        class="text-muted text-xs md:text-sm mb-2 text-uppercase font-semibold"
                      >
                        Total Amount
                      </p>
                      <p class="text-xs md:text-sm mb-0">
                        <span
                          >${data?.totalFees ? data?.totalFees : "00"}
                          ${data?.currency ? " " + data?.currency : ""}</span
                        >
                      </p>
                    </div>
                  </div>
                </div>
    
                <!-- Table -->
                <div class="mb-8 table-responsive table-container">
                  <div class="scrollable-table scrollable-table">
                    <table
                      class="table w-full border-collapse border border-gray-300"
                    >
                      <thead>
                        <tr class="bg-gray-200 text-xs md:text-sm text-center">
                          <th scope="col" class="py-2">#</th>
                          <th scope="col" class="py-2">Order ID</th>
                          <th scope="col" class="py-2">Name</th>
                          <th scope="col" class="py-2">Charge Type</th>
                          <th scope="col" class="py-2">Guardian ID</th>
                          <th scope="col" class="py-2">Player ID</th>
                          <th scope="col" class="py-2">Fees</th>
                          <th scope="col" class="py-2">Billing Status</th>
                          <th scope="col" class="py-2">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${data?.data?.map(
                          (d, i) => `
                        <tr class="text-xs md:text-sm text-center">
                          <td class="py-2">${i + 1}</td>
                          <td class="py-2">${
                            d?.orderId ? d?.orderId : "--"
                          }</td>
                          <td class="py-2">${d?.name ? d?.name : "--"}</td>
                          <td class="py-2">
                            ${d?.orderType ? d?.orderType : "--"}
                          </td>
                          <td class="py-2">
                            ${d?.guardianId ? d?.guardianId : "--"}
                          </td>
                          <td class="py-2">${
                            d?.playerId ? d?.playerId : ""
                          }</td>
                          <td class="py-2">${d?.fees ? d?.fees : "--"}</td>
                          <td
                            class="py-2 bg-warning-subtle text-warning font-semibold"
                          >
                            ${d?.status ? d?.status : "--"}
                          </td>
                          <td class="py-2">${d?.fees ? d?.fees : "--"}</td>
                        </tr>
                        `
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
    
                <!-- Totals -->
                <div class="border-t border-b border-gray-200 py-4 totals">
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 total-particle">
                    <div class="child-total">
                      <div class="text-sm md:text-base">Sub Total :</div>
                      <div class="text-sm md:text-base text-end">
                        ${data?.SubTotal ? data?.SubTotal : "--"} ${
      data?.currency ? " " + data?.currency : ""
    }
                      </div>
                    </div>
                    <div class="child-total">
                      <div class="text-sm md:text-base">GST (1 %) :</div>
                      <div class="text-sm md:text-base text-end">
                        ${data.gst ? data?.gst : "00"} ${
      data?.currency ? " " + data?.currency : ""
    } 
                      </div>
                    </div>
                    <div
                      class="child-total border-top border-top-dashed text-base md:text-xl col-span-2 md:col-span-3"
                    >
                      <div>Total Amount :</div>
                      <div class="text-end">
                        ${data?.totalFees ? data?.totalFees : "00"} ${
      data?.currency ? " " + data?.currency : ""
    }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    
        <script
          src="https://cdn.jsdelivr.net/npm/alpinejs@2.8.2/dist/alpine.min.js"
          defer
        ></script>
      </body>
    </html>
    `,
  };

  await transpoter.sendMail(mailOption, async (error, info) => {
    if (error) {
      console.log(error);
      mailRes = false;
    } else {
      console.log("Email sent: " + info.response);
      mailRes = true;
    }
  });

  return mailRes;
};

module.exports = sendPlayerRegistrationInvoiceEmail;
