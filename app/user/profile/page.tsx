// // app/user/profile.page.tsx

// app/user/profile.page.tsx

import { handleWhoAmI } from "@/app/lib/actions/auth-action";
import { notFound, redirect } from "next/navigation";
import UpdateUserForm from "../_components/UpdateProfile";

export default async function Page() {
    const result = await handleWhoAmI();

    if (!result.success) {
        redirect('/login');
    }

    if (!result.data) {
        notFound();
    }

    return (
        <div>
            <UpdateUserForm user={result.data} />
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