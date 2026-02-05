// // app/user/profile.page.tsx

// app/user/profile.page.tsx

import { handleWhoAmI } from "@/app/lib/actions/auth-action"; // Import handleWhoAmI
import { notFound, redirect } from "next/navigation";
import UpdateUserForm from "../_components/UpdateProfile";

export default async function Page() {
    const result = await handleWhoAmI();  // Call handleWhoAmI to get current user info

    if (!result.success) {
        redirect('/login');  // Redirect to login if not authenticated
    }

    if (!result.data) {
        notFound();  // Show 404 if no user data is returned
    }

    return (
        <div>
            <UpdateUserForm user={result.data} />  {/* Pass the user data to the UpdateUserForm */}
        </div>
    );
}


// import { handleWhoAmI } from "@/app/lib/actions/auth-action";
// import { notFound, redirect } from "next/navigation";
// import UpdateUserForm from "../_components/UpdateProfile";

// export default async function Page() {
//     const result = await handleWhoAmI();

//     if (!result.success) {
//         redirect('/login');
//     }

//     if (!result.data) {
//         notFound();
//     }

//     return (
//         <div>
//             <UpdateUserForm user={result.data} />
//         </div>
//     );
// }