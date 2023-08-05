import Head from 'next/head';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import LayoutUnauthenticated from '../components/LayoutUnauthenticated';

export default function NewUser() {
  const { data: session } = useSession();
  const router = useRouter();

  const [airline, setAirline] = useState('');
  const [color, setColor] = useState('#000000');

  const createUser = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const createUserResponse = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: session.user.name,
          email: session.user.email,
          airline,
          color,
        }),
      });

      if (!createUserResponse.ok) {
        throw new Error('Error creating user');
      }
      console.log('User created successfully');
      router.push('/feed'); // Navigate to /feed on successful user creation
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  if (!session) {
    return <LayoutUnauthenticated />;
  } else {
    return (
      <>
        <style jsx global>{`
          html,
          body {
            height: 100%;
          }
          body {
            display: -ms-flexbox;
            display: -webkit-box;
            display: flex;
            -ms-flex-align: center;
            -ms-flex-pack: center;
            -webkit-box-align: center;
            align-items: center;
            -webkit-box-pack: center;
            justify-content: center;
            padding-top: 40px;
            padding-bottom: 40px;
            background-color: #f5f5f5;
            text-align: center!important;
          }
          .form-signin {
            max-width: 330px;
            padding: 15px;
          }
          
          .form-signin .form-floating:focus-within {
            z-index: 2;
          }
          
          .form-signin input[type="email"] {
            margin-bottom: -1px;
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
          }
          
          .form-signin input[type="password"] {
            margin-bottom: 10px;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
          }
          .color-selector-div{
            padding-top: 12px;
            padding-bottom: 12px;
            padding-left: 0px;
            padding-right: 0px;
          }
          .color-selector{
            width: 100%!important;
          }
        `}</style>
        <main className="form-signin w-100 m-auto text-center">
          <form onSubmit={createUser}>
            <img className="mb-4" src="/images/favicon.svg" alt="" width="100" height="100" />
            <h1 className="h3 mb-3 fw-normal">Cria sua companhia aérea</h1>
            <div className="form-floating">
              <input type="text" className="form-control" id="airline" value={airline} onChange={e => setAirline(e.target.value)} />
              <label className="form-label" for="airline">Nome:</label>
            </div>
            <div className="color-selector-div">
              <input type="color" id="color" className="form-control form-control-color color-selector" value={color} onChange={e => setColor(e.target.value)} />
            </div>
            <button className="w-100 btn btn-lg btn-secondary"type="submit">Fundar companhia</button>
            <p className="mt-5 mb-3 text-muted">© 2017–2022</p>
          </form>
        </main>
      </>
    );
  }
}
