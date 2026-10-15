"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Lantern } from "@/components/imam/Lantern";

// Форма вопроса имаму. Фонарь рядом разгорается по мере того, как пишется вопрос.
// Пока муфтият не назначил, кто отвечает (PRODUCT.md, открытый вопрос 10), отправка закрыта — без бэкенда и без имитации.

const TOPICS = ["Намаз", "Пост", "Закят и садака", "Семья и никах", "Обряды", "Другое"] as const;
const CHANNELS = ["На почту", "В Telegram"] as const;
const MAX = 2000;
/** Сколько символов нужно, чтобы фонарь разгорелся полностью. */
const FULL = 280;

export function AskForm({ open }: { open: boolean }) {
  const [topic, setTopic] = useState<(typeof TOPICS)[number] | null>(null);
  const [text, setText] = useState("");
  const [channel, setChannel] = useState<(typeof CHANNELS)[number]>("На почту");
  const [contact, setContact] = useState("");
  const [publish, setPublish] = useState(true);
  const [consent, setConsent] = useState(false);
  const id = useId();
  const glow = text.trim().length / FULL;
  const ready = open && topic && text.trim().length >= 10 && contact.trim() && consent;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_320px]">
      <form
        onSubmit={(e) => e.preventDefault()}
        aria-describedby={`${id}-state`}
        className="grid gap-6 rounded-[24px] border border-line bg-surface p-5 md:p-8"
      >
        <fieldset>
          <legend className="text-[14px] font-semibold text-fg-2">О чём вопрос</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={topic === t}
                onClick={() => setTopic(t)}
                className={`min-h-[44px] rounded-full px-4 text-[14.5px] font-semibold transition-colors duration-200 ${
                  topic === t ? "bg-zarya text-on-gold" : "bg-chip text-chip-fg hover:brightness-95"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor={`${id}-q`} className="text-[14px] font-semibold text-fg-2">
            Ваш вопрос
          </label>
          <textarea
            id={`${id}-q`}
            value={text}
            maxLength={MAX}
            onChange={(e) => setText(e.target.value)}
            rows={7}
            placeholder="Напишите так, как спросили бы имама после намаза. Стесняться нечего."
            className="mt-2 w-full resize-y rounded-[18px] border border-line bg-transparent px-5 py-4 text-[17px] leading-[1.55] text-fg placeholder:text-fg-3 focus:border-fg-3 focus:outline-none"
          />
          <p className="mt-1.5 text-right text-[13px] text-fg-3 tabular-nums">
            {text.length} / {MAX}
          </p>
        </div>

        <fieldset>
          <legend className="text-[14px] font-semibold text-fg-2">Куда прислать ответ</legend>
          <div className="mt-2 flex gap-1.5 rounded-[18px] bg-chip p-1.5">
            {CHANNELS.map((c) => (
              <label
                key={c}
                className={`inline-flex min-h-[44px] flex-1 cursor-pointer items-center justify-center rounded-full text-[14.5px] font-semibold transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zarya ${
                  channel === c ? "bg-zarya text-on-gold" : "text-chip-fg"
                }`}
              >
                <input
                  type="radio"
                  name={`${id}-ch`}
                  className="sr-only"
                  checked={channel === c}
                  onChange={() => setChannel(c)}
                />
                {c}
              </label>
            ))}
          </div>
          <label htmlFor={`${id}-c`} className="sr-only">
            {channel === "На почту" ? "Электронная почта" : "Имя пользователя в Telegram"}
          </label>
          <input
            id={`${id}-c`}
            type={channel === "На почту" ? "email" : "text"}
            autoComplete={channel === "На почту" ? "email" : "off"}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder={channel === "На почту" ? "you@example.ru" : "@имя_в_telegram"}
            className="mt-2 h-[48px] w-full rounded-full border border-line bg-transparent px-5 text-[16px] text-fg placeholder:text-fg-3 focus:border-fg-3 focus:outline-none"
          />
          <p className="mt-1.5 text-[13px] text-fg-3">Контакт видит только имам — имя спрашивать не будем.</p>
        </fieldset>

        <div className="grid gap-3 text-[15px] leading-[1.45]">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
              className="mt-0.5 size-5 shrink-0 accent-[#F2B57C]"
            />
            <span>Можно опубликовать вопрос и ответ без имени — вдруг он поможет кому-то ещё</span>
          </label>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 size-5 shrink-0 accent-[#F2B57C]"
            />
            <span>
              Согласен на обработку персональных данных по{" "}
              <Link href="/politika" className="underline underline-offset-2 hover:text-accent">
                политике сайта
              </Link>
            </span>
          </label>
        </div>

        <div className="grid gap-3">
          <button
            type="submit"
            disabled={!ready}
            className="inline-flex h-[52px] items-center justify-center rounded-full bg-zarya px-6 text-[15px] font-bold text-on-gold transition-colors duration-200 hover:bg-[#f5c08f] disabled:cursor-not-allowed disabled:opacity-55"
          >
            Отправить вопрос имаму
          </button>
          <p id={`${id}-state`} className="text-[14px] leading-[1.5] text-fg-2">
            {open
              ? "Имам ответит лично. Если разрешите — ответ без имени появится в разделе ниже."
              : "Приём вопросов откроется, когда муфтият назначит имама, который будет отвечать. Форму уже можно посмотреть."}
          </p>
        </div>
      </form>

      {/* Фонарь: на телефоне — над формой, на компьютере — рядом и не уезжает при прокрутке */}
      <div
        data-theme="dark"
        className="order-first flex flex-col items-center overflow-hidden rounded-xl bg-[radial-gradient(120%_90%_at_50%_70%,#1E2A5C_0%,#0B1636_75%)] px-6 pt-4 pb-6 text-center text-light lg:sticky lg:top-24 lg:order-none"
      >
        <Lantern glow={glow} className="h-[200px] w-auto md:h-[280px]" />
        <p aria-live="polite" className="mt-2 min-h-[3em] text-[14.5px] leading-[1.45] text-light/75">
          {text.trim().length === 0
            ? "Фонарь разгорается, пока вы пишете"
            : glow < 1
              ? "Пишите спокойно — имам прочитает всё"
              : "Вопрос готов — можно отправлять"}
        </p>
      </div>
    </div>
  );
}
