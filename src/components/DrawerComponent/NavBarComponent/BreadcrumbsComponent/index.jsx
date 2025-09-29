import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

function BreadcrumbsComponent() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Inicio
        </Link>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          const isLast = index === pathnames.length - 1;
          return isLast ? (
            <Typography key={to} color="text.primary">
              {decodeURIComponent(value)}
            </Typography>
          ) : (
            <Link
              component={RouterLink}
              key={to}
              to={to}
              underline="hover"
              color="inherit"
            >
              {decodeURIComponent(value)}
            </Link>
          );
        })}
      </Breadcrumbs>
    </>
  );
}

export default BreadcrumbsComponent;
