"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SimpleBackToSiteLayout from "@/components/SimpleBackToSiteLayout";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth guard: redirect to login if not authenticated
  useEffect(() => {
    setLoading(true);
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("risen_admin_token");
        if (!token) {
          router.replace("/admin/login");
        } else {
          setAuthChecked(true);
        }
      }
    } catch (err) {
      setError("Failed to check authentication");
    } finally {
      setLoading(false);
    }
  }, [router]);

                  if (!token && !isLoginPage) {
                    router.replace("/admin/login");
                  } else {
                    setAuthChecked(true);
                  }
                }

              }
              setLoading(false);
            }, [router, isLoginPage]);

            if (loading) {
              return (
                <div style={{ color: "#2EDBFF", textAlign: "center", marginTop: 80 }}>
                  Checking authentication...
                </div>
              );
            }

            // allow login page to render freely
            if (isLoginPage) {
              return <>{children}</>;
            }

            // protect only admin dashboard pages
            if (!authChecked) {
              return null;
            }

            return <SimpleBackToSiteLayout>{children}</SimpleBackToSiteLayout>;
          }
