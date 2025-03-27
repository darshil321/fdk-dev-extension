import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import urlJoin from "url-join";
import loaderGif from "../public/assets/loader.gif";
import Layout from "./components/Layouts/Layout";
import "./style/home.css";

const EXAMPLE_MAIN_URL = window.location.origin;

export const Home = () => {
  const [pageLoading, setPageLoading] = useState(false);
  const [ setProductList] = useState([]);
  const { application_id, company_id } = useParams();

  useEffect(() => {
    isApplicationLaunch() ? fetchApplicationProducts() : fetchProducts();
  }, [application_id]);

  console.log("application_id", application_id, company_id, window.location);

  const fetchProducts = async () => {
    setPageLoading(true);
    try {
      const { data } = await axios.get(
        urlJoin(EXAMPLE_MAIN_URL, "/api/products"),
        {
          headers: {
            "x-company-id": company_id,
          },
        }
      );
      setProductList(data.items);
    } catch (e) {
      console.error("Error fetching products:", e);
    } finally {
      setPageLoading(false);
    }
  };

  const fetchApplicationProducts = async () => {
    setPageLoading(true);
    try {
      console.log("EXAMPLE_MAIN_URL", EXAMPLE_MAIN_URL);
      const { data } = await axios.get(
        urlJoin(
          EXAMPLE_MAIN_URL,
          `/api/products/application/${application_id}`
        ),
        {
          headers: {
            "x-company-id": company_id,
          },
        }
      );

      setProductList(data.items);
    } catch (e) {
      console.error("Error fetching application products:", e);
    } finally {
      setPageLoading(false);
    }
  };



  const isApplicationLaunch = () => !!application_id;

  return (
    <>
      {pageLoading ? (
        <div className="loader" data-testid="loader">
          <img src={loaderGif} alt="loader GIF" />
        </div>
      ) : (
        <div className="app">
          <Layout companyId={company_id} applicationId={application_id} />
        </div>
      )}
    </>
  );
};
