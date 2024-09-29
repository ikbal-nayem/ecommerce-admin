import { InvoiceService } from "services/api/Invoice.service";
import { ToastService } from "services/utils/toastr.service";
import { imageURLGenerate } from "utils/utils";

const getBase64FromUrl = async (url) => {
  const data = await fetch(url);
  const blob: any = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
  });
};

export const generatePDF = async (
  store_id: string,
  orderId: string,
  stateSetter: Function,
  error: Function
) => {
  const invoiceData = InvoiceService.getOrderInvoice({
    body: { id: orderId, storeId: store_id },
  });
  const storeData = InvoiceService.getStoreDetails();

  Promise.all([invoiceData, storeData])
    .then(async ([invoiceData, storeData]) => {
      const imgPromise = await invoiceData?.body?.orderLineList?.map((it) =>
        getBase64FromUrl(imageURLGenerate(it?.thumbnail))
      );
      Promise.all(imgPromise).then((imgRes) => {
        invoiceData?.body?.orderLineList?.forEach((item, idx) => {
          item.thumbnail = imgRes[idx];
        });
        stateSetter({
          invoiceData: {
            invoice: invoiceData?.body,
            store: storeData?.body,
          },
          invoiceItemData: invoiceData?.body?.orderLineList,
        });
      });

      // TODO:: it's used for jsPDF or manualPDF to render data properly

      // setTimeout(() => {
      //   // InvoicePDF(invoiceData.body, storeData.body);
      //   // manualPDF("invoiceDIV");
      // }, 1000);
    })
    .catch((err) => {
      // to handle error from wherever it's use
      error();
      ToastService.error(err.message);
    });
};

// generating pdf manually
export const manualPDF = (elemID) => {
  var printContents = document.getElementById(elemID);
  if (!printContents) {
    return;
  }
  printContents.style.display = "block";
  // print the div
  const cloneElement = printContents.cloneNode(true);
  // root div of react
  var root = document.getElementById("root");
  root.style.display = "none";
  // appending the div in body
  document.body.appendChild(cloneElement);
  window.print();
  // back to body
  document.body.removeChild(cloneElement);
  root.style.display = "block";
  printContents.style.display = "none";
};
