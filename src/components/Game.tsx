import { Canvas } from '@react-three/fiber';
import { Player } from './Player';
import { World } from './World';
import { DayNightCycle } from './DayNightCycle';
import { Suspense, useState, useEffect } from 'react';
import { isMobile } from '../utils/input';
import { TouchControls } from './TouchControls';
import { BookOpen, X } from 'lucide-react';
import AudioPlayer from './AudioPlayer';

const PRAYERS = [
  {
    id: 'suplica',
    title: 'Súplica',
    subtitle: 'Súplica a la Virgen del Carmen',
    textES: `Tengo mil dificultades: ayúdame.
De los enemigos del alma: sálvame.
En mis desaciertos: ilumíname.
En mis dudas y penas: confórtame.
En mis enfermedades: fortaléceme.
Cuando me desprecien: anímame.
En las tentaciones: defiéndeme.
En horas difíciles: consuélame.
Con tu corazón maternal: ámame.
Con tu inmenso poder: protégeme.
Y en tus brazos al expirar: recíbeme.
Virgen del Carmen, ruega por nosotros.
Amén.`,
    textEN: `I have a thousand difficulties: help me.
From the enemies of the soul: save me.
In my mistakes: enlighten me.
In my doubts and sorrows: comfort me.
In my illnesses: strengthen me.
When they despise me: encourage me.
In temptations: defend me.
In difficult hours: console me.
With your motherly heart: love me.
With your immense power: protect me.
And in your arms when expiring: receive me.
Our Lady of Mount Carmel, pray for us.
Amen.`
  },
  {
    id: 'promesa',
    title: 'Promesa',
    subtitle: 'Promesas del Santo Escapulario',
    textES: `1. Asistiré a la hora de la muerte a quienes lleven con fe y devoción mi Santo Escapulario o mi medalla o imagen.

2. Si os portáis para conmigo como hijos cariñosos: yo me portaré con vosotros como madre amabilísima.

3. Bendeciré las casas donde mi imagen sea honrada, y donde me recen cada día alguna oración.

4. Si os esforzáis por alejar el pecado de vuestra vida, yo me esforzaré por alejaros las desgracias y las calamidades.

6. Si queréis tener felicidad y santidad haced lo que Jesús os dice: O sea: "Leed el Evangelio y tratad de practicar lo que allí os recomienda Nuestro Señor. Si así lo hacéis Yo rogaré por vosotros ahora y en la hora de vuestra muerte."`,
    textEN: `1. I will assist at the hour of death those who wear my Holy Scapular or my medal or image with faith and devotion.

2. If you behave towards me as affectionate children, I will behave towards you as a most loving mother.

3. I will bless the homes where my image is honored, and where they pray to me some prayer every day.

4. If you strive to keep sin away from your life, I will strive to keep misfortunes and calamities away from you.

6. If you want to have happiness and holiness, do what Jesus tells you: That is, "Read the Gospel and try to practice what Our Lord recommends there. If you do so, I will pray for you now and at the hour of your death."`
  },
  {
    id: 'oracion',
    title: 'Oración',
    subtitle: 'Oración a la Virgen del Carmen',
    textES: `Estrella del Mar, Reina de los Cielos,
Protectora de los viajeros, 
Oh Madre mía!
Consuelo de mi corazón,
Protectora de mi alma,
Amor eterno, clemente y piadosa, pido tu guía,
Tu protección, tu intercesión.
Mi devoción a tu amoroso corazón,
Confío en ti mis plegarias, mis necesidades
conocidas y desconocidas, añoranzas de mi corazón,
Me encomiendo a ti madre, Señora del Carmen, del Amparo y del Amor Eterno.
Se que nos escuchas, cúbrenos con tu manto protector por favor,
no nos abandones y pide a tu hijo que por favor nunca se olvide de nosotros.
Amén.`,
    textEN: `Star of the Sea, Queen of Heaven,
Protector of travelers,
Oh my Mother!
Comfort of my heart,
Protector of my soul,
Eternal love, merciful and compassionate, I ask for your guidance,
Your protection, your intercession.
My devotion to your loving heart,
I entrust to you my prayers, my needs
known and unknown, longings of my heart,
I commend myself to you Mother, Our Lady of Carmel, of Protection and of Eternal Love.
I know you hear us, please cover us with your protective mantle,
do not abandon us and please ask your son never to forget us.
Amen.`
  },
  {
    id: 'aparicion',
    title: 'Aparición',
    subtitle: 'La visión de San Simón Stock',
    textES: 'La aparición de la Virgen del Carmen (también conocida como Nuestra Señora del Monte Carmelo) ocurrió el 16 de julio de 1251 en Cambridge, Inglaterra, ante San Simón Stock, superior de la Orden Carmelita. En este encuentro, la Virgen se apareció vestida con el hábito carmelita, coronada de estrellas y con el Niño Jesús en brazos, entregándole el Escapulario como signo de protección y alianza sempiterna, prometiendo la salvación a quienes murieran con esta devoción.',
    textEN: 'The apparition of the Virgin of Carmel (also known as Our Lady of Mount Carmel) occurred on July 16, 1251, in Cambridge, England, to Saint Simon Stock, superior of the Carmelite Order. In this encounter, the Virgin appeared dressed in the Carmelite habit, crowned with stars and holding the Child Jesus, presenting him with the Scapular as a sign of protection and everlasting covenant, promising salvation to those who die wearing this devotion with faith.'
  },
  {
    id: 'historia',
    title: 'Historia',
    subtitle: 'La Virgen del Cerrito del Carmen en Guatemala',
    textES: `Historia de la Virgen del Cerrito del Carmen en Guatemala

La historia de la Virgen del Cerrito del Carmen tiene sus raíces en el convento de Ávila. Santa Teresa de Ávila, reformadora del Carmelo y fundadora del Carmelo Descalzo, tuvo una visión durante una profunda oración en la que la Virgen María, vestida de blanco, extendía su manto para proteger a cuatro frailes carmelitas. Este hecho fue interpretado como una señal del amparo divino a su congregación.

A raíz de esta experiencia, alrededor de 1566, Santa Teresa mandó tallar una imagen que representara lo que había visto. La pieza fue elaborada en madera de cedro, con un tamaño aproximado de 44 centímetros. Esta imagen fue colocada en la celda de la santa, frente a la cual oró en varias ocasiones. Aunque Santa Teresa deseaba traer la devoción al Nuevo Mundo, no lo logró en vida.

Juan Corz y la misión

El deseo de Santa Teresa fue transmitido por sus hermanas del convento a Juan Corz, un ermitaño genovés que viajaría hacia América. A él le fue confiada la imagen, bajo la indicación de que la Virgen elegiría su lugar de permanencia.
Dice la leyenda que la Virgen había dicho a Santa Teresa que donde ella llegara se fundaría una gran ciudad.

Corz ingresó a Guatemala por el Golfo Dulce y se estableció en el entonces “Valle de las Vacas” en unas cuevas cercanas al actual puente Belice, conocidas como La Leonera. Juan Corz estuvo con la Virgen del Carmen durante entre 10 y 15 años en una cueva, hasta que los vecinos llegan y le piden que la ponga en otro lugar donde puedan venerarla.

Encuentran un lugar en la explanada del Valle de las Vacas, posiblemente por la parte central de la actual zona 6 capitalina. Construyen un oratorio y dejan ahí a la Virgen. Al siguiente día se llevan una sorpresa al ver que la Virgen ha desaparecido del oratorio. Se realiza una frenética búsqueda y encuentran que había regresado a la cueva en donde había estado.

Los vecinos comprenden que la Virgen no quiere estar en ese oratorio, y buscan un nuevo lugar. Encuentran un cerro lleno de pajonales altos y construyen en la cima una humilde capilla con techo y paredes de paja, y frente a ella un ranchito, donde viviría Juan Corz. Corz, que había estado en el Monte Carmelo, consideró que el lugar era adecuado y lo llamó el “Carmelo de América”, ahora el Cerrito del Carmen.

Fundación de la ermita en 1613

Fue en el año 1613 cuando se construyó la primera ermita en honor a la Virgen. Desde entonces, el cerro tomó relevancia como un sitio religioso, y Juan Corz se estableció allí como su guardián. Esta devoción marcó el inicio del Valle de la Virgen, donde posteriormente se fundó la Nueva Guatemala de la Asunción.

Con el tiempo, la imagen fue revestida con túnica y manto de plata, y rodeada por una mandorla dorada que conserva hasta hoy. Aún se reconoce por sus dos advocaciones: Nuestra Señora del Carmen y Nuestra Señora del Amparo.

El robo de la imagen y su recuperación

El 19 de abril de 2001, la imagen fue robada del Cerrito del Carmen. Después de dos años, fue localizada en una aldea del interior del país gracias a la información proporcionada durante una campaña médica en Tecpán. El 6 de marzo de 2003 regresó al Cerrito, aunque sin algunos de sus elementos originales, como su corona y la media luna.

Celebración cada 16 de julio

Cada año, el barrio se llena de fervor el domingo posterior al 16 de julio, fecha que se celebra a la Virgen del Carmen. Desde temprano se escuchan cohetes, campanas y marimbas, mientras los fieles llegan a la iglesia para celebrar a su patrona. Durante la misa se recuerda la vida de Santa Teresa, San Juan de la Cruz y el valor espiritual del escapulario carmelita.

La procesión de la Virgen del Carmen es una de las más esperadas. La imagen, adorada con flores y ángeles, es acompañada por devotos que la consideran una presencia cercana. Es una figura que ha atravesado siglos, fronteras y adversidades, permaneciendo como un símbolo de fe para Guatemala.

¿Por qué en Guatemala se hizo tan popular la devoción de la Virgen del Carmen?

Cuenta la leyenda que hacia finales del siglo XIX, un padre popularizó la devoción de la Virgen del Carmen en todo el país.
Su nombre era Francisco Javier Zaldúa, hijo del asistente del entonces presidente de la República, Justo Rufino Barrios, ambos ateos. Irónicamente, el hijo llegó a ser uno de los mas devotos sacerdotes de Guatemala, pero llevaba en sí la gran pena de que el presidente rechazaba todo lo que tuviera que ver con la Iglesia.
Entonces Francisco Javier prometió a la Virgen del Carmen que, si salvaba el alma del presidente, impidiendo que muriera sin confesión, dedicaría su vida a propagar su devoción.

Y sucedió exactamente eso. Un día en el que el presidente Barrios se dirigía a pie a la Casa Presidencial, se desató un aguacero torrencial por lo que tuvieron que buscar refugio en la primera tienda que encontraron. El presidente le preguntó su edad al tendero, un tipo de mala fama. Este respondió tristemente: "Ay su Excelencia, tengo 80 para el mundo y ninguno para Dios".

Fueron estas palabras el toque de la gracia. Le siguieron zumbando en los oídos al General Barrios y ya no le dejaban quietud. Al poco tiempo le llegó la enfermedad que lo hubiese llevado al sepulcro si no hubiese muerto en la batalla de Chalchuapa, El Salvador (el General Barrios es uno de los pocos presidentes guatemaltecos que ha muerto ejerciendo las funciones de Primer Mandatario al mando de un ejército). Al sentirse enfermo meses antes del inicio de la conflagración bélica llamó al sacerdote y a Venancio Barrios para que escuchara y le dijo: Mira, la Casa de Gobierno está llena de masones que no dejarán entrar a ningún sacerdote, pero por la casa vecina se puede poner una escalera. Tráeme el Nuncio de su Santidad para que me perdone todas mis grandes faltas.
Y el Nuncio vino, y entró por la ventana, por medio de la escalera de contrabando, y le administró los sacramentos. El viejo General-Presidente decía luego al sacerdote: ¿Ves que para tu Virgencita del Carmen no hay imposibles? Ella no necesita puertas para salvar a los que se le encomiendan.

Desde entonces el padre Javier Zaldúa se volvió el más entusiasta propagador de la devoción del Carmen. La fiesta del 16 de julio en la Catedral Metropolitana empezó a ser la más sonada de todo el año. Los milagros se multiplicaban. Al estallar un polvorín en el Mercado Central, allí cerca, los únicos que estaban con vida al llegar un sacerdote a darles la absolución eran dos obreros que tenían el Santo Escapulario. La Virgen del Carmen es la Reina de la popularidad en Guatemala.`,
    textEN: `History of the Virgin of Cerrito del Carmen in Guatemala

The history of the Virgin of Cerrito del Carmen has its roots in the convent of Ávila. Saint Teresa of Ávila, reformer of Carmel and founder of the Discalced Carmelites, had a vision during deep prayer in which the Virgin Mary, dressed in white, extended her mantle to protect four Carmelite friars. This event was interpreted as a sign of divine protection over her congregation.

Following this experience, around 1566, Saint Teresa ordered an image to be carved representing what she had seen. The piece was made of cedar wood, with an approximate size of 44 centimeters. This image was placed in the cell of the saint, where she prayed on several occasions. Although Saint Teresa wished to bring the devotion to the New World, she did not achieve it in her lifetime.

Juan Corz and the mission

The wish of Saint Teresa was transmitted by her sisters of the convent to Juan Corz, a Genoese hermit who would travel to America. The image was entrusted to him, under the indication that the Virgin would choose her place of permanence.
Legend says that the Virgin had told Saint Teresa that where she arrived, a great city would be founded.

Corz entered Guatemala through Golfo Dulce and settled in the then "Valle de las Vacas" in some caves near the current Belice bridge, known as La Leonera. Juan Corz stayed with the Virgin of Carmel for between 10 and 15 years in a cave, until the neighbors arrived and asked him to place her in another location where they could venerate her.

They found a place in the flat area of Valle de las Vacas, possibly in the central part of current Zone 6 of the capital. They built an oratory and left the Virgin there. The next day they were surprised to see that the Virgin had disappeared from the oratory. A frantic search was carried out, and they found that she had returned to the cave where she had been.

The neighbors understood that the Virgin did not want to be in that oratory, and searched for a new place. They found a hill full of high pastures and built a humble chapel with a straw roof and walls at the summit, and in front of it a small hut where Juan Corz would live. Corz, who had been to Mount Carmel, considered the place suitable and called it the "Carmel of America," now the Cerrito del Carmen.

Foundation of the Hermitage in 1613

It was in the year 1613 when the first hermitage was built in honor of the Virgin. Since then, the hill took on relevance as a religious site, and Juan Corz settled there as its guardian. This devotion marked the beginning of the Valley of the Virgin, where the New Guatemala of the Assumption was subsequently founded.

Over time, the image was clad in silver robes and mantle, and surrounded by a golden mandorla that she preserves to this day. She is still recognized by her two titles: Our Lady of Carmel and Our Lady of Protection.

The theft of the image and its recovery

On April 19, 2001, the image was stolen from Cerrito del Carmen. After two years, she was located in an inland village thanks to information provided during a medical campaign in Tecpán. On March 6, 2003, she returned to Cerrito, although without some of her original elements, such as her crown and half moon.

Celebration every July 16

Every year, the neighborhood is filled with fervor on the Sunday after July 16, the date the Virgin of Carmel is celebrated. From early on, firecrackers, bells, and marimbas are heard, while the faithful arrive at the church to celebrate their patron saint. During the mass, the lives of Saint Teresa, Saint John of the Cross, and the spiritual value of the Carmelite scapular are remembered.

The procession of the Virgin of Carmel is one of the most anticipated events. The image, adorned with flowers and angels, is accompanied by devotees who consider her a close presence. She is a figure that has crossed centuries, borders, and adversities, remaining as a symbol of faith for Guatemala.

Why did devotion to the Virgin of Carmel become so popular in Guatemala?

Legend says that towards the end of the 19th century, a priest popularized devotion to the Virgin of Carmel throughout the country.
His name was Francisco Javier Zaldúa, son of the assistant to the then President of the Republic, Justo Rufino Barrios, both atheists. Ironically, the son became one of the most devoted priests in Guatemala, but carried a great sorrow: the president rejected everything related to the Church.
So Francisco Javier promised the Virgin of Carmel that if she saved the president's soul, preventing him from dying without confession, he would dedicate his life to propagating her devotion.

And exactly that happened. One day, while President Barrios was walking to the Presidential House, a torrential downpour broke out, forcing them to seek shelter in the first shop they found. The president asked the shopkeeper, a man of bad reputation, his age. He replied sadly: "Ah, Your Excellency, I am 80 for the world and none for God."

Those words were the touch of grace. They kept buzzing in General Barrios's ears and left him no rest. Shortly after, he fell ill, which would have taken him to the grave had he not died in the Battle of Chalchuapa, El Salvador (General Barrios is one of the few Guatemalan presidents who died in office while leading an army). Feeling sick months before the start of the war, he called the priest and Venancio Barrios so that he could listen, and told him: Look, the Government Palace is full of Masons who won't let any priest in, but through the neighboring house, a ladder can be placed. Bring me His Holiness's Nuncio so he can forgive my great sins.
And the Nuncio came, and entered through the window, via the smuggled ladder, and administered the sacraments. The old General-President later told the priest: "Do you see that for your Little Virgin of Carmel there are no impossibles? She doesn't need doors to save those who entrust themselves to her."
Since then, Father Javier Zaldúa became the most enthusiastic propagator of the devotion of Carmel. The July 16 festival in the Metropolitan Cathedral began to be the most celebrated of the year. Miracles multiplied. When a powder magazine exploded near the Central Market, the only ones found alive when a priest arrived to give absolution were two workers wearing the Holy Scapular. The Virgin of Carmel is the Queen of popularity in Guatemala.`
  }
];

export default function Game() {
  const [isLocked, setIsLocked] = useState(false);
  const [overlayDismissed, setOverlayDismissed] = useState(false);
  const [isNearAltar, setIsNearAltar] = useState(false);
  const [prayerOpen, setPrayerOpen] = useState(false);
  const [selectedPrayerId, setSelectedPrayerId] = useState('suplica');
  const [lang, setLang] = useState<'ES' | 'EN'>('ES');

  useEffect(() => {
    const handleNearAltar = (e: any) => setIsNearAltar(e.detail);
    window.addEventListener('nearAltar', handleNearAltar);
    window.dispatchEvent(new CustomEvent('requestNearAltar'));
    return () => window.removeEventListener('nearAltar', handleNearAltar);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyP') {
        setPrayerOpen(prev => !prev);
      } else if (e.code === 'Escape') {
        setOverlayDismissed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (prayerOpen) {
      if (document.exitPointerLock) {
        document.exitPointerLock();
      }
      const timer = setTimeout(() => {
        if (document.pointerLockElement && document.exitPointerLock) {
          document.exitPointerLock();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [prayerOpen]);

  const currentPrayer = PRAYERS.find(p => p.id === selectedPrayerId) || PRAYERS[0];

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative touch-none select-none">
      <Canvas shadows camera={{ fov: 75, far: 800 }}>
        <fog attach="fog" args={['#aaddff', 150, 500]} />
        <Suspense fallback={null}>
          <DayNightCycle />
          <Player 
            onLock={() => setIsLocked(true)} 
            onUnlock={() => {
              setIsLocked(false);
              setOverlayDismissed(false);
            }} 
            prayerActive={prayerOpen} 
          />
          <World />
        </Suspense>
      </Canvas>
      
      {/* Target Reticle (only when locked and prayer is closed) */}
      {!prayerOpen && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-2 h-2 bg-white rounded-full opacity-50" />
        </div>
      )}
      
      {isMobile && !prayerOpen && <TouchControls />}

      {!isLocked && !overlayDismissed && !isMobile && !prayerOpen && (
        <div 
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/60 z-10 cursor-pointer pointer-events-auto"
          onClick={() => setOverlayDismissed(true)}
        >
          <div className="text-white text-center p-8 bg-gray-900/80 rounded-xl backdrop-blur-sm border border-white/10 max-w-md">
            <h1 className="text-4xl font-bold mb-4 font-sans text-amber-500">Ermita del Carmen</h1>
            <p className="text-lg mb-2 text-stone-200">Haz clic en cualquier lugar para empezar</p>
            
            <div className="text-xs text-amber-200/80 bg-amber-950/40 p-3.5 rounded-lg border border-amber-500/20 my-4 leading-relaxed text-left">
              💡 <span className="font-semibold text-amber-300">Nota del Navegador:</span> Si la vista 3D no captura tu cursor automáticamente por seguridad, puedes <span className="text-amber-300 font-semibold">hacer clic y arrastrar con el ratón</span> para mirar a tu alrededor libremente.
            </div>

            <div className="text-sm text-gray-400 space-y-1.5 mt-4 text-left border-t border-stone-800 pt-4">
              <p className="flex justify-between"><span>Moverse:</span> <span className="text-stone-300 font-mono">W, A, S, D / Flechas</span></p>
              <p className="flex justify-between"><span>Mirar:</span> <span className="text-stone-300 font-mono">Arrastrar ratón / Mirar</span></p>
              <p className="flex justify-between"><span>Oraciones:</span> <span className="text-stone-300 font-mono">Tecla P</span></p>
              <p className="flex justify-between"><span>Encender Velas:</span> <span className="text-stone-300 font-mono">Tecla E (cerca del altar)</span></p>
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                setOverlayDismissed(true);
              }}
              className="mt-6 w-full py-3 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-bold rounded-lg shadow-lg transition-colors duration-200 touch-auto cursor-pointer"
            >
              Comenzar
            </button>
          </div>
        </div>
      )}
      
      {isMobile && !prayerOpen && (
        <div className="absolute top-4 left-4 text-white font-mono bg-black/50 p-4 rounded-lg pointer-events-none z-40">
          <h1 className="text-xl font-bold mb-2">Ermita del Carmen</h1>
          <p className="text-sm">Lado izquierdo: Moverse</p>
          <p className="text-sm">Lado derecho: Mirar</p>
        </div>
      )}

      {isNearAltar && !prayerOpen && (
        <div className="absolute bottom-36 md:bottom-24 left-1/2 transform -translate-x-1/2 pointer-events-auto z-50">
          {isMobile ? (
            <button 
              className="bg-orange-600/90 hover:bg-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg backdrop-blur-sm border border-orange-400/30 flex items-center gap-2 touch-auto"
              onTouchStart={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('lightCandle')); }}
            >
              <span className="text-xl">🕯️</span> Encender vela
            </button>
          ) : (
            <div className="bg-black/60 text-white px-6 py-3 rounded-full backdrop-blur-sm border border-white/20 shadow-xl flex items-center gap-2 whitespace-nowrap">
              <span className="text-xl">🕯️</span> <span className="font-bold text-orange-400">Presiona E</span> para encender una vela
            </div>
          )}
        </div>
      )}

      {/* Prayer Trigger Button (always in lower right corner) */}
      <div 
        className="absolute bottom-22 md:bottom-6 right-4 md:right-6 z-40 flex flex-col items-end gap-1.5"
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
        onMouseUp={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
        onPointerUp={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
      >
        <button
          onClick={() => setPrayerOpen(prev => !prev)}
          className="bg-amber-800/95 hover:bg-amber-700 active:scale-95 text-amber-50 px-5 py-3 rounded-xl font-medium shadow-2xl backdrop-blur-md border border-amber-500/40 flex items-center gap-2.5 transition-all duration-200 cursor-pointer pointer-events-auto"
        >
          <BookOpen className="w-5 h-5 text-amber-300" />
          <span className="text-sm tracking-wide font-sans">Leer Oración</span>
        </button>
        {!isMobile && (
          <p className="text-[10px] text-amber-400/60 font-mono bg-black/60 px-2.5 py-0.5 rounded border border-amber-500/10 backdrop-blur-sm">
            Presiona 'P' para abrir/cerrar
          </p>
        )}
      </div>

      {/* Prayer Booklet Modal */}
      {prayerOpen && (
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 pointer-events-auto select-text touch-auto"
          onClick={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
          }}
        >
          <div className="bg-stone-900 border border-amber-500/30 rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh] text-stone-100 font-sans touch-auto">
            {/* Top decorative gradient border */}
            <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 w-full" />
            
            {/* Close button */}
            <button
              onClick={() => setPrayerOpen(false)}
              className="absolute top-3 right-3 md:top-4 md:right-4 text-stone-400 hover:text-amber-400 hover:scale-110 active:scale-90 bg-stone-800 hover:bg-stone-700 p-2 rounded-full border border-stone-700/50 transition-all cursor-pointer z-50 pointer-events-auto"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header section */}
            <div className="px-4 pt-6 pb-3 md:px-6 md:pt-8 md:pb-4 text-center border-b border-stone-800">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-amber-500 font-semibold font-mono">Devocionario de la Ermita</span>
              <h2 className="text-xl md:text-3xl font-serif text-amber-100 tracking-wide mt-1">Oraciones del Camino</h2>
              
              {/* Language selection toggles */}
              <div className="flex justify-center mt-3 md:mt-4 pointer-events-auto">
                <div className="bg-stone-950 p-0.5 rounded-lg border border-stone-800 inline-flex items-center gap-1">
                  <button
                    onClick={() => setLang('ES')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      lang === 'ES' ? 'bg-amber-700 text-white shadow font-semibold' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Español
                  </button>
                  <button
                    onClick={() => setLang('EN')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      lang === 'EN' ? 'bg-amber-700 text-white shadow font-semibold' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>

            {/* Prayer Book Selection Tabs */}
            <div className="px-4 py-2 bg-stone-950/60 flex flex-wrap gap-1.5 md:gap-2 justify-center border-b border-stone-800/60 pointer-events-auto touch-auto">
              {PRAYERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPrayerId(p.id)}
                  className={`px-2.5 py-1.5 md:px-3.5 md:py-1.5 rounded-lg text-[11px] md:text-xs tracking-wide transition-all duration-200 cursor-pointer pointer-events-auto ${
                    selectedPrayerId === p.id
                      ? 'bg-amber-950/40 text-amber-200 border border-amber-500/50 font-medium shadow-inner'
                      : 'bg-stone-900/40 text-stone-400 hover:text-stone-200 border border-transparent'
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>

            {/* Main Prayer Text Box with styled medieval ambient glow */}
            <div className="flex-1 overflow-y-auto touch-auto px-4 py-6 md:px-8 md:py-10 flex flex-col bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-stone-950 min-h-[180px] scrollbar-thin pointer-events-auto">
              <div className={`${selectedPrayerId === 'historia' ? 'max-w-2xl text-left' : 'max-w-md text-center my-auto'} w-full mx-auto space-y-4 py-2`}>
                <span className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-amber-500/70 block font-serif text-center">
                  — {currentPrayer.subtitle} —
                </span>
                <p className={`text-sm md:text-base leading-relaxed text-stone-200 font-serif px-2 select-text whitespace-pre-line ${
                  selectedPrayerId === 'historia' ? 'text-left font-sans not-italic text-stone-300' : 'text-center italic text-balance'
                }`}>
                  {selectedPrayerId === 'historia' ? '' : '"'}
                  {lang === 'ES' ? currentPrayer.textES : currentPrayer.textEN}
                  {selectedPrayerId === 'historia' ? '' : '"'}
                </p>
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent mx-auto mt-4 md:mt-6" />
              </div>
            </div>

            {/* Footer containing hints and copyright */}
            <div className="px-6 py-3 md:py-4 bg-stone-950 border-t border-stone-800 text-center text-[10px] md:text-[11px] text-stone-500 font-mono flex justify-between items-center pointer-events-auto">
              <span>Ermita del Carmen</span>
              <span className="text-amber-500/50">Presiona 'P' o la 'X' para cerrar</span>
            </div>
          </div>
        </div>
      )}

      {/* Meditative Audio Player Widget */}
      <AudioPlayer />
    </div>
  );
}
