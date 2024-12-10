"use client"

import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function Page() {
   const [state, setState] = useState<string>("");

   useEffect(() => {
      async function fetchData() {
         const response = await fetch("/api/cron/notify", {
            method: "GET",
         });
      }
      fetchData();
   }, [state])


   return (
      <Button onPress={() => console.log("Press")}>Press me</Button>
   )
}
