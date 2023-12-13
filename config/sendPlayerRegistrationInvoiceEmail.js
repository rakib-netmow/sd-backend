const nodemailer = require("nodemailer");

const sendPlayerRegistrationInvoiceEmail = (email, data) => {
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
          }
        </style>
        <title>Your Invoice</title>
      </head>
      <body class="font-sans bg-gray-100">
        <div class="container mx-auto p-4">
          <!-- Breadcrumb -->
          <nav class="text-gray-500 text-xs mb-4 md:text-sm">
            <a href="#" class="text-blue-500 hover:underline">Home</a> /
            <span class="text-gray-700">Invoices</span>
          </nav>
    
          <div class="flex justify-center">
            <div class="w-full max-w-3xl">
              <!-- Invoice Card -->
              <div class="bg-white shadow-md rounded-md p-4 md:p-8 mb-8">
                <!-- Header -->
                <div
                  class="flex flex-col md:flex-row items-center justify-between mb-4"
                >
                  <!-- Logo goes here -->
                  <div class="mb-4 md:mb-0">
                    <!-- Replace with your logo -->
                    <img
                      src="path/to/your/logo.png"
                      alt="Logo"
                      class="h-8 md:h-12"
                    />
                  </div>
    
                  <!-- Billing Address -->
                  <div class="text-center md:text-right">
                    <h6
                      class="text-muted text-uppercase text-base md:text-xl font-semibold mb-2 md:mb-0"
                    >
                      Billing Address
                    </h6>
                    <p class="text-muted text-xs md:text-sm mb-1">${
                      data?.name ? data?.name : "--"
                    }</p>
                    <p class="text-muted text-xs md:text-sm mb-1">${
                      data?.email ? data?.email : "--"
                    }</p>
                    <p class="text-muted text-xs md:text-sm mb-1">${
                      data?.city ? data?.city : "--"
                    }</p>
                    <p class="text-muted text-xs md:text-sm mb-1">
                      ${data?.address ? data?.address : "--"}, ${
      data?.zip ? " " + data?.zip : "--"
    }, ${data?.country ? data?.country : "--"}
                    </p>
                    <p class="text-muted text-xs md:text-sm mb-1">
                      Phone: ${data?.phone ? data?.phone : "--"}
                    </p>
                  </div>
                </div>
    
                <!-- Invoice Details -->
                <div class="mb-5">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p
                        class="text-muted text-xs md:text-sm mb-2 text-uppercase font-semibold"
                      >
                        Invoice No
                      </p>
                      <p class="text-xs md:text-sm mb-0">
                        ${data?.invoiceId}
                      </p>
                    </div>
                    <div>
                      <p
                        class="text-muted text-xs md:text-sm mb-2 text-uppercase font-semibold"
                      >
                        Date
                      </p>
                      <p class="text-xs md:text-sm mb-0">
                        ${data?.date}
                      </p>
                    </div>
                    <div>
                      <p
                        class="text-muted text-xs md:text-sm mb-2 text-uppercase font-semibold"
                      >
                        Payment Status
                      </p>
                      <p class="text-xs md:text-sm mb-0 text-success font-semibold">
                        <span class="text-center">${
                          data?.status ? data?.status : "--"
                        }</span>
                      </p>
                    </div>
                    <div>
                      <p
                        class="text-muted text-xs md:text-sm mb-2 text-uppercase font-semibold"
                      >
                        Total Amount
                      </p>
                      <p class="text-xs md:text-sm mb-0">$<span>$${
                        data?.totalFees ? data?.totalFees : "00"
                      } ${data?.currency ? " " + data?.currency : ""}</span></p>
                    </div>
                  </div>
                </div>
    
                <!-- Table -->
                <div class="mb-8 table-responsive">
                  <div class="scrollable-table">
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
                        (d, i) =>
                          `
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
                          <td class="py-2 bg-warning-subtle text-warning font-semibold">
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
                <div class="border-t border-b border-gray-200 py-4">
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div class="text-sm md:text-base">Sub Total :</div>
                    <div class="text-sm md:text-base text-end">${
                      data?.SubTotal ? data?.SubTotal : "--"
                    }</div>
                    <div class="text-sm md:text-base">GST (1 %) :</div>
                    <div class="text-sm md:text-base text-end">${
                      data.gst ? data?.gst : "00"
                    }</div>
                    <div
                      class="border-top border-top-dashed text-base md:text-xl col-span-2 md:col-span-3"
                    >
                      <div>Total Amount :</div>
                      <div class="text-end">${
                        data?.totalFees ? data?.totalFees : "00"
                      }</div>
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
    </html>`,
  };

  transpoter.sendMail(mailOption, async (error, info) => {
    if (error) {
      console.log(error);
      return false;
    } else {
      console.log("Email sent: " + info.response);
      return true;
    }
  });
};

module.exports = sendPlayerRegistrationInvoiceEmail;
