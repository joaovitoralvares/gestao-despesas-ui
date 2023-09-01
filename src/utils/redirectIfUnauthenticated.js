import { useRouter } from "vue-router"

export const redirectIfUnauthenticated = (status) => {
    const router = useRouter();

    if (status == 401) {
        console.log(status);
        router.push('/');
    }
}