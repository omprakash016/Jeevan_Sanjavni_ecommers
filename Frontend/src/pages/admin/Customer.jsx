import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Users,
  Eye,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  UserCheck,
  UserX,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import Container from "../../component/ui/Container";

import {
  getAllCustomers,
} from "../../services/adminCustomerService";

import "./Customer.css";


const Customers = () => {

  const navigate = useNavigate();

  const [customers, setCustomers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [sort, setSort] =
    useState("latest");

  const [page, setPage] =
    useState(1);

  const [pagination, setPagination] =
    useState({
      currentPage: 1,
      totalPages: 1,
      totalCustomers: 0,
    });


  const fetchCustomers = useCallback(
    async () => {

      try {

        setLoading(true);

        const response =
          await getAllCustomers({
            page,
            limit: 10,
            search,
            status,
            sort,
          });

        if (!response.success) {
          toast.error(
            response.message ||
              "Failed to load customers"
          );
          return;
        }

        setCustomers(
          response.data?.customers || []
        );

        setPagination(
          response.data?.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalCustomers: 0,
          }
        );

      } catch (error) {

        console.error(
          "Customers Error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load customers"
        );

      } finally {

        setLoading(false);

      }

    },
    [page, search, status, sort]
  );


  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);


  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };


  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };


  const formatDate = (date) => {

    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  if (loading) {

    return (
      <section className="admin-customers-page">

        <Container>

          <div className="customers-loading">

            <RefreshCw
              size={40}
              className="spin"
            />

            <h2>
              Loading Customers...
            </h2>

            <p>
              Please wait while we fetch
              customer information.
            </p>

          </div>

        </Container>

      </section>
    );
  }


  return (

    <section className="admin-customers-page">

      <Container>

        {/* HEADER */}

        <div className="customers-header">

          <div>

            <span className="customers-eyebrow">
              JEEVAN SANJIVANI
            </span>

            <h1>
              Customers
            </h1>

            <p>
              Manage your registered
              customers and their orders.
            </p>

          </div>

          <div className="customers-count">

            <Users size={22} />

            <div>

              <strong>
                {pagination.totalCustomers}
              </strong>

              <span>
                Total Customers
              </span>

            </div>

          </div>

        </div>


        {/* FILTER BAR */}

        <div className="customers-toolbar">

          <div className="customer-search">

            <Search size={19} />

            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={handleSearch}
            />

          </div>


          <select
            value={status}
            onChange={handleStatusChange}
            className="customer-filter"
          >

            <option value="all">
              All Customers
            </option>

            <option value="active">
              Active
            </option>

            <option value="blocked">
              Blocked
            </option>

          </select>


          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="customer-filter"
          >

            <option value="latest">
              Latest
            </option>

            <option value="oldest">
              Oldest
            </option>

            <option value="name">
              Name
            </option>

          </select>

        </div>


        {/* TABLE */}

        <div className="customers-table-card">

          {customers.length === 0 ? (

            <div className="customers-empty">

              <Users size={55} />

              <h2>
                No Customers Found
              </h2>

              <p>
                Try changing your search
                or filter.
              </p>

            </div>

          ) : (

            <div className="customers-table-wrapper">

              <table className="customers-table">

                <thead>

                  <tr>

                    <th>
                      Customer
                    </th>

                    <th>
                      Contact
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Verification
                    </th>

                    <th>
                      Joined
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {customers.map(
                    (customer) => (

                      <tr
                        key={
                          customer._id
                        }
                      >

                        <td>

                          <div className="customer-profile">

                            <div className="customer-avatar">

                              {customer
                                .profileImage
                                ?.url ? (

                                <img
                                  src={
                                    customer
                                      .profileImage
                                      .url
                                  }
                                  alt={
                                    customer.fullName
                                  }
                                />

                              ) : (

                                <Users
                                  size={20}
                                />

                              )}

                            </div>


                            <div>

                              <strong>
                                {
                                  customer.fullName
                                }
                              </strong>

                              <span>
                                Customer
                              </span>

                            </div>

                          </div>

                        </td>


                        <td>

                          <div className="customer-contact">

                            <span>
                              {
                                customer.email
                              }
                            </span>

                            <span>
                              {
                                customer.phone
                              }
                            </span>

                          </div>

                        </td>


                        <td>

                          <span
                            className={`customer-status ${
                              customer.isActive
                                ? "active"
                                : "blocked"
                            }`}
                          >

                            {customer.isActive ? (
                              <>
                                <UserCheck
                                  size={14}
                                />
                                Active
                              </>
                            ) : (
                              <>
                                <UserX
                                  size={14}
                                />
                                Blocked
                              </>
                            )}

                          </span>

                        </td>


                        <td>

                          <span
                            className={`verification-status ${
                              customer.isVerified
                                ? "verified"
                                : "unverified"
                            }`}
                          >

                            {customer.isVerified
                              ? "Verified"
                              : "Not Verified"}

                          </span>

                        </td>


                        <td>

                          {formatDate(
                            customer.createdAt
                          )}

                        </td>


                        <td>

                          <button
                            className="view-customer-btn"
                            onClick={() =>
                              navigate(
                                `/admin/customers/${customer._id}`
                              )
                            }
                          >

                            <Eye size={17} />

                            View

                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* PAGINATION */}

        {pagination.totalPages > 1 && (

          <div className="customers-pagination">

            <button
              disabled={
                !pagination.hasPreviousPage
              }
              onClick={() =>
                setPage(
                  (previous) =>
                    previous - 1
                )
              }
            >

              <ChevronLeft size={18} />

              Previous

            </button>


            <span>

              Page{" "}

              <strong>
                {pagination.currentPage}
              </strong>

              {" "}of{" "}

              <strong>
                {pagination.totalPages}
              </strong>

            </span>


            <button
              disabled={
                !pagination.hasNextPage
              }
              onClick={() =>
                setPage(
                  (previous) =>
                    previous + 1
                )
              }
            >

              Next

              <ChevronRight size={18} />

            </button>

          </div>

        )}

      </Container>

    </section>

  );
};

export default Customers;