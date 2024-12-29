import type { NextPage } from 'next'

const RootPage: NextPage = () => {
  return <div/>;
}

export async function getServerSideProps() {
     return {
        redirect: {
            destination: '/home',
            permanent: false,
        },
    };
}


export default RootPage
