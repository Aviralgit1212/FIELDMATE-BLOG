/* Deep Field Ledger: content-first engineering documentation with a quiet signal network underneath. */
import SignalNetwork from "@/components/SignalNetwork";
import ScrollReveal from "@/components/ScrollReveal";

const diagram = `                        FIELD TECHNICIAN
                          🎙️        📷
                           │         │
                           ▼         ▼
                  LiveKit WebRTC Transport
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
       Deepgram Flux STT          Vision Engine
     (streaming transcript)     (Groq · qwen3.6-27b)
              │                         │
              ▼                         │
       Query Stabilizer                 │
     (entities + meaningful             │
          delta detected)               │
              │                         │
     ┌────────┴────────┐                │
     ▼                 ▼                │
  Tier 1 LRU      Tier 2 Qdrant         │
  (<0.1ms)      Semantic Cache (<10ms)  │
     │                 │                │
     └────────┬────────┘                │
              ▼ miss                    │
     Tier 3 · Qdrant Domain Memory      │
      (dense + BM25 hybrid search)      │
              │                         │
              └────────────┬────────────┘
                            ▼
                  Diagnostic State Engine
              (DomainEvents · evidence rank ·
                contradiction detection)
                            │
                            ▼
                  Parallel Turn Router
            (speculative Groq raced against
                  Qdrant retrieval)
                            │
                            ▼
                 Pronunciation Normalizer
                            │
                            ▼
                Rime WS / Deepgram Aura TTS
                            │
                            ▼
                     🎧 TECHNICIAN`;

function SectionMarker({ index, label }: { index: string; label: string }) {
  return (
    <div className="section-marker" aria-hidden="true">
      <span>{index}</span>
      <i />
      <small>{label}</small>
    </div>
  );
}

export default function Home() {
  return (
    <div className="technical-blog">
      <SignalNetwork />
      <ScrollReveal />
      <header className="blog-header">
        <a href="#top" className="wordmark" aria-label="Visual Resolution home">
          <span className="mark">⌁</span>
          <span>
            VISUAL
            <br />
            RESOLUTION
          </span>
        </a>
        <span className="header-status">
          <i /> FIELD NOTE / 01
        </span>
        <a
          href="https://github.com/Aviralgit1212/FIELDMATEV3"
          target="_blank"
          rel="noreferrer"
        >
          GITHUB ↗
        </a>
      </header>
      <main id="top">
        <section className="hero" aria-labelledby="title">
          <p className="eyebrow">ENGINEERING NOTE / VOICE + VISION + MEMORY</p>
          <h1 id="title">Visual Resolution</h1>
          <p className="subtitle">
            How a voice-first repair assistant learned to see — and where
            it&apos;s headed next
          </p>
          <div className="hero-rule" />
          <p>
            Every broken device eventually needs one thing: someone who knows
            what to look for. A laptop that won&apos;t boot, a van that starts
            throwing warning lights on a highway with no service station in
            sight, a factory panel humming at the wrong pitch — in each case,
            the fix usually exists in someone&apos;s head, and that someone is
            not standing next to you.
          </p>
          <p>
            That gap is the problem we set out to close. Not by writing another
            chatbot that answers questions about manuals, but by building
            something that can look at a machine the way a technician does,
            listen the way a colleague does, and talk you through a fix the way
            a mentor does — in real time, without waiting for an appointment.
            That&apos;s the mindset behind <strong>FieldMate</strong>, and
            it&apos;s also where the idea we call{" "}
            <strong>Visual Resolution</strong> comes from.
          </p>
          <a href="#visual-resolution" className="scroll-cue">
            SCROLL TO READ <span>↓</span>
          </a>
        </section>

        <article>
          <section id="visual-resolution" className="article-section">
            <SectionMarker index="01" label="OPTICAL INPUT" />
            <h2>What &quot;Visual Resolution&quot; Means</h2>
            <p>
              Words run out fast when you&apos;re describing a physical problem.
              &quot;It&apos;s making a weird noise&quot; or &quot;there&apos;s a
              red light near the fan&quot; only gets a diagnostic system so far
              — the rest of the information is sitting right there in front of
              you, visible, but untranslated. Visual Resolution is our name for
              the moment a system stops relying on your description alone and
              starts resolving the problem from what it can actually see: a
              fault code on a screen, the color of an LED, a component that
              looks physically wrong.
            </p>
            <p>
              This matters more than it sounds like it should, because of who
              repair still depends on. Diagnosis and repair have traditionally
              been technician-owned skills — you call someone, you wait, you pay
              a callout fee, and eventually an expert arrives who can interpret
              what you couldn&apos;t. That model assumes a technician is nearby.
              Even in a country as infrastructure-dense as the United States,
              that assumption breaks constantly — rural service deserts,
              understaffed repair shops, night-time breakdowns, or simply a
              queue that&apos;s three days long. If capability is locked behind
              certification and proximity, most people are stuck waiting for
              help that may not come in time.
            </p>
            <p>
              Picture the scenario directly: you&apos;re driving a heavy vehicle
              and a warning light comes on, or something under the hood starts
              sounding wrong. There&apos;s no technician within reach and no
              manual that covers your exact symptom. What you need in that
              moment is a way to point a camera at the problem, describe it out
              loud, and get back a spoken, specific next step — not a search
              result, an actual diagnosis grounded in what&apos;s visibly in
              front of you. That&apos;s the exact situation Visual Resolution is
              designed for: audio and visual understanding working together, on
              the spot, standing in for the technician who isn&apos;t there.
            </p>
          </section>

          <section id="diagnosis" className="article-section">
            <SectionMarker index="02" label="LIVE DIAGNOSTIC PATH" />
            <h2>Inside a Diagnosis</h2>
            <p>
              FieldMate&apos;s current build targets Windows PCs and laptops
              from Lenovo, Dell, HP, and ASUS, across hardware, software, and
              networking faults — a deliberately bounded domain, chosen so the
              system can be genuinely reliable rather than shallow across
              everything. Here&apos;s the shape of the system a single
              diagnostic turn actually travels through:
            </p>
            <figure className="terminal-box">
              <figcaption>LIVE DIAGNOSTIC PATH / ASCII ARCHITECTURE</figcaption>
              <pre>{diagram}</pre>
            </figure>
            <p>
              Consider what this looks like in use: point the camera at an open
              laptop chassis and say &quot;it&apos;s overheating.&quot; A vision
              system built this way could identify visible thermal-paste
              degradation on the CPU die, read a manufacturer logo off the
              chassis to confirm the OEM, and pass those observations — not a
              picture, but structured facts — into the same reasoning step that
              handles voice. The response that comes back would name a specific
              cause and a specific fix, grounded in what the system actually saw
              rather than in a guess pieced together from your words alone. That
              loop, sight feeding directly into spoken diagnosis, is what Visual
              Resolution is designed to do — the capability the pipeline is
              built for, not a claim about what any single run has already
              proven.
            </p>
          </section>

          <section id="architecture" className="article-section">
            <SectionMarker index="03" label="STATE / EVIDENCE / RETRIEVAL" />
            <h2>The Architecture, From Basics</h2>
            <p>
              The diagram above is the map. This section is the territory — what
              each box is actually doing, in the order a real diagnostic turn
              hits them, and why each one exists rather than being an obvious
              default.
            </p>
            <p>
              <strong>1. One transport, two kinds of input.</strong> Audio and
              camera frames both travel over the same LiveKit WebRTC connection
              — a single low-latency channel carrying the technician&apos;s
              voice and, when needed, a video data channel carrying image
              frames. Nothing about the transport cares whether a given moment
              is &quot;a voice turn&quot; or &quot;a vision turn&quot;; that
              distinction is decided further downstream.
            </p>
            <p>
              <strong>
                2. Speech doesn&apos;t wait to be finished before it&apos;s
                used.
              </strong>{" "}
              Deepgram Flux streams partial transcripts continuously — not one
              final sentence, but a growing string of words as the technician is
              still talking. Querying the vector database on every one of those
              partials would be wasteful and slow. So a{" "}
              <code>QueryStabilizer</code> sits in between: it normalizes each
              partial, pulls out structured entities from it — an OEM name like
              &quot;Dell&quot; or &quot;Lenovo,&quot; a component keyword like
              &quot;RAM&quot; or &quot;wifi,&quot; a fault-code pattern like{" "}
              <code>0x0000012</code> or <code>WHEA_UNCORRECTABLE_ERROR</code> —
              and only signals &quot;this is worth acting on&quot; once the
              transcript has changed by a meaningful number of words. It never
              calls Qdrant itself; its only job is deciding <em>when</em> a
              half-finished sentence already carries enough signal to be worth
              acting on.
            </p>
            <p>
              <strong>
                3. The answer starts forming before the question is finished.
              </strong>{" "}
              Once the stabilizer gives the go-ahead, two things start racing
              each other in parallel: a speculative call to the language model
              begins drafting a response immediately, while a retrieval call
              queries Qdrant for grounding evidence at the same time. This is
              the <code>ParallelTurnRouter</code>, and the important part
              isn&apos;t &quot;fire two requests and take whichever finishes
              first&quot; — the speculative draft is held back, never spoken,
              until the retrieval side resolves. If Qdrant comes back
              irrelevant, times out, or fails outright, the speculative draft
              that was already generating gets released to the technician
              immediately. If Qdrant comes back with something relevant, the
              speculative draft is discarded and a new, evidence-grounded
              response is generated in its place. The technician never hears an
              ungrounded guess when real documentation exists to ground it — but
              they also never sit waiting on retrieval that wouldn&apos;t have
              changed the answer.
            </p>
            <p>
              <strong>
                4. Three tiers stand between a question and a full search.
              </strong>{" "}
              A repeated exact query is answered from an in-memory cache in
              under a tenth of a millisecond. A paraphrased repeat — same
              problem, different words — is caught by a semantic cache in
              Qdrant, matched by vector similarity and scoped strictly per
              technician and per hardware context so one person&apos;s session
              never leaks into another&apos;s. Only a genuinely new question
              falls through to the real search: a hybrid of dense embeddings and
              BM25 keyword matching over the long-term memory of verified
              procedures and past resolutions.
            </p>
            <p>
              <strong>5. Vision observes. It does not diagnose.</strong> The
              vision model is given exactly one job, and the system prompt is
              explicit about the boundary: extract directly observable facts and
              stop there. It&apos;s told never to guess a manufacturer or model
              from generic appearance — a hardware identifier is only allowed
              through when a logo, label, service tag, or BIOS screen is
              literally visible in frame. Before anything else happens, the
              model first has to classify what it&apos;s even looking at —
              laptop, motherboard, face, phone, or unknown — and if that
              classification comes back as anything other than a device, any
              hardware identifiers the model tried to report get silently
              discarded. That&apos;s what stops a stray photo of someone&apos;s
              face from accidentally being treated as a Dell chassis. Every
              genuine observation — a lit fault LED, a visible stop code, a
              physically degraded component — comes back as one item in a flat,
              labeled list, so the reasoning layer downstream can weigh a visual
              fact exactly the way it weighs a spoken claim.
            </p>
            <p>
              <strong>
                6. State only changes through named events, never directly.
              </strong>{" "}
              Nothing writes into the session state object on its own authority.
              When the reasoning model proposes a new fact — &quot;equipment
              identified as a Dell XPS 15,&quot; &quot;overheating symptom
              recorded&quot; — that proposal becomes a <code>DomainEvent</code>,
              and only the <code>StateEngine</code> is allowed to validate and
              apply it. Every turn also carries a turn and generation counter:
              if a new utterance starts before the previous one has finished
              being processed, the in-flight result for the old turn is
              recognized as stale and quietly dropped instead of being spoken
              over the new input. That&apos;s the mechanism that keeps an
              interruption from producing two answers talking over the new
              input.
            </p>
            <p>
              <strong>
                7. Evidence has a rank, and contradictions get named instead of
                buried.
              </strong>{" "}
              The reasoning layer is instructed to weigh evidence in order: what
              the technician says, then what the camera has directly shown, then
              sensor readings, then retrieved documentation. And when what
              someone says out loud conflicts with what the camera just captured
              — &quot;the fan isn&apos;t spinning&quot; while the frame clearly
              shows it rotating — the system isn&apos;t allowed to quietly pick
              a side. It keeps both statements in state, flags the contradiction
              explicitly, and asks a clarifying question instead of guessing
              which one is true.
            </p>
            <p>
              <strong>
                8. The last step is making sure it&apos;s actually understood.
              </strong>{" "}
              Covered in more detail below — but by the time a response reaches
              speech, it has already been rewritten so a human ear can parse it
              correctly.
            </p>
            <p>
              That&apos;s the full loop — not a simplified explainer of the
              system, but the actual path a diagnostic turn takes through the
              real code.
            </p>
          </section>

          <section id="rime" className="article-section">
            <SectionMarker
              index="04"
              label="SPEECH / INTERRUPTION / DELIVERY"
            />
            <h2>Why We Chose Rime</h2>
            <p>
              Voice is the layer people notice first, and it&apos;s the hardest
              one to get right for a diagnostic tool, because it has to survive
              interruption. A technician mid-repair doesn&apos;t wait politely
              for the assistant to finish a sentence — they cut in, correct
              themselves, or say &quot;wait, stop&quot; the moment they spot
              something. That ruled out anything built primarily for narration
              or long-form reading.
            </p>
            <p>
              Rime is built specifically for real-time conversational speech
              rather than for narrating a paragraph — synthesis speeds low
              enough (well under a second, down to tens of milliseconds on its
              faster model) that a response can start streaming before the
              sentence behind it is even finished. It also avoids the flat,
              over-enunciated delivery that makes a lot of TTS obviously
              synthetic, which matters when someone is relying on the voice for
              a genuinely stressful moment like a breakdown.
            </p>
            <p>
              That speed doesn&apos;t help if the words themselves are
              unreadable out loud, though — nobody wants to hear &quot;check the
              B S O D log&quot; pronounced as one garbled word, or
              &quot;1920x1080&quot; read as &quot;nineteen twenty x ten
              eighty.&quot; Starting from the kind of pronunciation handling
              Rime&apos;s own tooling already supports, we built out a fuller
              normalization layer that rewrites technical text before it ever
              reaches the TTS call: acronyms get spelled out letter by letter,
              some get their own phonetic spelling entirely (&quot;BIOS&quot;
              becomes &quot;bye-oss,&quot; &quot;SATA&quot; becomes
              &quot;say-tah&quot;), symbols get converted to words, and units
              get expanded — <code>~50ms</code> becomes &quot;approximately 50
              milliseconds,&quot; <code>10°C</code> becomes &quot;10 degrees
              Celsius.&quot; Rime handles the delivery; our layer makes sure
              what it&apos;s delivering actually makes sense to a human ear.
              There&apos;s also a second engine, Deepgram Aura, wired in as a
              fallback path — so a TTS outage never means the whole assistant
              goes silent.
            </p>
            <p>
              Right now, this all runs as a browser tool — a React and Vite
              frontend talking to the backend over LiveKit&apos;s web
              components, open in a tab, camera and microphone permission
              granted once. It works, and it&apos;s fully usable today. But a
              browser tab isn&apos;t the shape this idea is actually pointed at.
            </p>
          </section>

          <section
            id="product-vision"
            className="article-section closing-section"
          >
            <SectionMarker
              index="05"
              label="WEARABLE / ATTENTION / EXPERTISE"
            />
            <h2>Product Vision: The Interface Disappears</h2>
            <p>
              Today, using FieldMate looks like this: hold the device, point a
              camera at it, speak, and wait for an answer. That&apos;s four
              steps, and three of them are just getting information into the
              system before it can even start helping.
            </p>
            <p>
              The version we actually want looks like this:{" "}
              <strong>look, speak, hear.</strong> Nothing held up, nothing
              pointed, nothing opened. The camera is wherever your attention
              already is, because it&apos;s on your face. The goal isn&apos;t to
              build &quot;FieldMate for Meta Glasses&quot; as a feature
              checkbox. The goal is to remove the interface standing between a
              technician and the intelligence that can help them — so that
              expertise stops being something you have to stop and set up a
              phone for, and becomes something that&apos;s simply there the
              moment you look at a problem and start talking.
            </p>
            <p>
              To be upfront about where this actually stands: it&apos;s a
              direction, not a shipped feature. The team doesn&apos;t have Meta
              Glasses hardware yet, and until we do, this stays a deliberate
              next step rather than a claim about what&apos;s built. What exists
              today — the browser-based voice-and-vision loop described above —
              was built hardware-agnostic on the frontend on purpose, so that
              moving the camera and the earpiece onto a wearable later is an
              extension of the architecture, not a rewrite of it.
            </p>
            <p>
              The browser is where FieldMate starts. Glasses are where we want
              to take it. But neither one is actually the product. The product
              is the moment expertise becomes available simply because the
              problem and ask for help.
            </p>
            <p className="technology-thanks">
              A special thank you to{" "}
              <a href="https://rime.ai" target="_blank" rel="noreferrer">
                <strong>Rime</strong>
              </a>
              ,{" "}
              <a href="https://pathway.com" target="_blank" rel="noreferrer">
                <strong>Pathway</strong>
              </a>
              ,{" "}
              <a href="https://livekit.io" target="_blank" rel="noreferrer">
                <strong>LiveKit</strong>
              </a>
              ,{" "}
              <a href="https://deepgram.com" target="_blank" rel="noreferrer">
                <strong>Deepgram</strong>
              </a>
              ,{" "}
              <a href="https://groq.com" target="_blank" rel="noreferrer">
                <strong>Groq</strong>
              </a>
              , and{" "}
              <a href="https://qdrant.tech" target="_blank" rel="noreferrer">
                <strong>Qdrant</strong>
              </a>{" "}
              for the technologies that helped us build FieldMate&apos;s
              real-time voice, vision, memory, and reasoning pipeline.
            </p>
            <p className="github-closing">
              The project is open on GitHub:{" "}
              <a
                href="https://github.com/Aviralgit1212/FIELDMATEV3"
                target="_blank"
                rel="noreferrer"
              >
                github.com/Aviralgit1212/FIELDMATEV3
              </a>
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
