'use client'
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const navbarRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown
  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <div className="w-full z-50 px-10 shadow-md">
      <div className="navbar" ref={navbarRef}>
        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost text-xl">
            Dental Clinic
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="navbar bg-base-100 menu menu-horizontal px-1 space-x-6">
            <li>
              <Link href="/">Accueil</Link>
            </li>
            <li>
              <details open={openDropdown === "patient"} onClick={(e) => {e.preventDefault(); toggleDropdown("patient");}}>
                <summary>Patient</summary>
                <ul className="p-2">
                  <li>
                    <Link href="/new-patient">Enregistrer un patient</Link>
                  </li>
                  <li>
                    <Link href="/patients">Liste des patients</Link>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <details open={openDropdown === "appointments"} onClick={(e) => {e.preventDefault(); toggleDropdown("appointments");}}>
                <summary>Rendez-Vous</summary>
                <ul className="p-2">
                  <li>
                    <Link href="/appointments">Liste des Rendez-Vous</Link>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <details open={openDropdown === "payments"} onClick={(e) => {e.preventDefault(); toggleDropdown("payments");}}>
                <summary>Paiements</summary>
                <ul className="p-2">
                  <li>
                    <Link href="/payments">Liste des Paiements</Link>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <details open={openDropdown === "medications"} onClick={(e) => {e.preventDefault(); toggleDropdown("medications");}}>
                <summary>Médicaments</summary>
                <ul className="p-2">
                  <li>
                    <Link href="/new-medication">Ajouter des médicaments</Link>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
        <div className="navbar-end"></div>
      </div>
    </div>
  );
};

export default Navbar;