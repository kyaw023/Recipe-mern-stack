import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { Link } from "react-router-dom";

const PaginationComponent = ({ links, page, pageName }) => {
  const isAdminPage = pageName === "admin";
  return (
    <div className="">
      <Pagination className={" mt-10 border"}>
        <PaginationContent>
          {!isAdminPage && (
            <PaginationItem className=" rounded me-5">
              <Link
                to={`${
                  links?.previousPage
                    ? "/?page=" + (page - 1)
                    : "/?page=" + page
                }`}
              >
                <PaginationPrevious />
              </Link>
            </PaginationItem>
          )}

          <div className=" space-x-5 flex items-center py-2">
            {links?.paginationLinks?.map((link) => {
              if (link?.number == page) {
                return (
                  <PaginationItem key={link?.number}>
                    <Link
                      className={
                        "rounded  border border-slate-400  px-3 py-1.5"
                      }
                      to={`?page=${link?.number}`}
                      isActive
                    >
                      {link?.number}
                    </Link>
                  </PaginationItem>
                );
              } else {
                return (
                  <PaginationItem key={link?.number} className="rounded">
                    <Link to={`?page=${link?.number}`}>{link?.number}</Link>
                  </PaginationItem>
                );
              }
            })}
          </div>
          {!isAdminPage && (
            <PaginationItem className="ms-4">
              <Link
                to={`${
                  !!links?.nextPage ? "/?page=" + (page + 1) : "/?page=" + page
                }`}
              >
                <PaginationNext />
              </Link>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationComponent;
