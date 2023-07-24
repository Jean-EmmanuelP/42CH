import { useContext } from "react";
import GlobalContext from "~/context/GlobalContext";

interface Event {
  title: string;
  description: string;
  label: string;
  day: number;
  id: number;
}

export default function HomePage() {
  // Context
  const { weeklyEvents } = useContext(GlobalContext);

  // Hardcoded best and worst players
  const bestPlayers = [
    {
      name: "Player 1",
      img: "https://www.didierdrogbafoundation.org/sites/default/files/didier-drogba.jpg",

    },
    {
      name: "Player 2",
      img: "https://img.freepik.com/photos-gratuite/portrait-beau-jeune-homme-gros-plan_176420-15568.jpg",
    },
    {
      name: "Player 3",
      img: "https://www.superprof.fr/images/annonces/professeur-home-jeune-ingenieur-chinois-paris-capable-parler-francais-chinois-anglais.jpg",
    },
  ];

  const worstPlayers = [
    {
      name: "Player 6",
      img: "https://i.pinimg.com/736x/35/4e/16/354e1641081f40480fcb7236f3e7d7ea.jpg",
    },
    {
      name: "Player 7",
      img: "https://upload.wikimedia.org/wikipedia/commons/6/65/20180610_FIFA_Friendly_Match_Austria_vs._Brazil_Neymar_850_1705.jpg",
    },
    {
      name: "Player 8",
      img: "https://images.psg.media/media/192520/nasser-al-khelaifi-square.jpg?bgcolor=ffffff",
    },
  ];

  function BiggestEvent() {
    console.log(`you clicked on the image`);
    /*
      -> Mettre le pop up pour s'inscrire au big event
    */
  }

  // Render
  return (
    <div className="flex h-5/6 flex-col">
      <button onClick={() => BiggestEvent()} className="mb-auto mr-4">
        <img
          src="https://elie.net/static/images/banner/fuller-house-exposing-high-end-poker-cheating-devices.jpg"
          alt="BiggestEvent"
          className="ml-4 mt-4 w-full rounded-md object-cover shadow-md"
        />
      </button>
      <div className="flex flex-row">
        <div className="m-4 w-1/2 rounded-md border border-black bg-white p-2">
          <h2 className="mb-2 text-2xl font-semibold">Agenda</h2>
          <div className="h-80 overflow-auto rounded p-2">
            {weeklyEvents.map((event: Event, index: number) => (
              <div
                key={index}
                className="my-2 flex overflow-hidden rounded border border-black bg-white"
              >
                <div
                  className={`w-1/3 ${event.label} p-4 text-center text-white`}
                >
                  <p className="text-2xl">{new Date(event.day).getDate()}</p>
                  <p>
                    {new Date(event.day).toLocaleString("default", {
                      month: "long",
                    })}
                  </p>
                </div>
                <div className="w-2/3 p-4 pl-4">
                  <h3 className="text-xl font-bold text-black">
                    {event.title}
                  </h3>
                  <p className="text-gray-500">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="m-4 flex w-1/2 flex-row rounded-md border shadow-md">
          <div className="flex-1 border-r border-gray/25 bg-green-200/25 p-2">
            <h2 className="mb-4 text-center text-2xl font-semibold">
              Best Players
            </h2>
            <ul className="text-center">
              {bestPlayers.map((player, index) => (
                <li key={index} className="pb-4">
                  <img
                    src={player.img}
                    alt={player.name}
                    className="mr-2 inline-block h-14 w-14 rounded-full object-cover border border-gray shadow-md hover:border-green-500"
                  />
                  {player.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 p-2 bg-red-200/25">
            <h2 className="mb-4 text-center text-2xl font-semibold">
              Worst Players
            </h2>
            <ul className="text-center">
              {worstPlayers.map((player, index) => (
                <li key={index} className="pb-4">
                  <img
                    src={player.img}
                    alt={player.name}
                    className="mr-2 inline-block h-14 w-14 rounded-full object-cover border border-gray shadow-md hover:border-red-500"
                  />
                  {player.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
