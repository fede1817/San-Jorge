--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-26 10:40:44

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 24703)
-- Name: doctores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctores (
    id integer NOT NULL,
    nombre character varying(100),
    apellido character varying(100),
    especialidad character varying(100),
    matricula character varying(50)
);


ALTER TABLE public.doctores OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24702)
-- Name: doctores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.doctores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.doctores_id_seq OWNER TO postgres;

--
-- TOC entry 4836 (class 0 OID 0)
-- Dependencies: 219
-- Name: doctores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.doctores_id_seq OWNED BY public.doctores.id;


--
-- TOC entry 224 (class 1259 OID 24732)
-- Name: odontologos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.odontologos (
    id integer NOT NULL,
    nombre character varying(100),
    apellido character varying(100),
    email character varying(100),
    password_hash text
);


ALTER TABLE public.odontologos OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24731)
-- Name: odontologos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.odontologos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.odontologos_id_seq OWNER TO postgres;

--
-- TOC entry 4837 (class 0 OID 0)
-- Dependencies: 223
-- Name: odontologos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.odontologos_id_seq OWNED BY public.odontologos.id;


--
-- TOC entry 218 (class 1259 OID 24694)
-- Name: pacientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pacientes (
    id integer NOT NULL,
    nombre character varying(100),
    apellido character varying(100),
    cedula character varying(20),
    fecha_nacimiento date,
    telefono character varying(20),
    email character varying(100),
    odontologo_id integer
);


ALTER TABLE public.pacientes OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24693)
-- Name: pacientes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pacientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pacientes_id_seq OWNER TO postgres;

--
-- TOC entry 4838 (class 0 OID 0)
-- Dependencies: 217
-- Name: pacientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pacientes_id_seq OWNED BY public.pacientes.id;


--
-- TOC entry 222 (class 1259 OID 24712)
-- Name: tratamientos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tratamientos (
    id integer NOT NULL,
    paciente_id integer,
    doctor_id integer,
    fecha date NOT NULL,
    diagnostico text,
    procedimiento text,
    observaciones text,
    estado character varying(50) DEFAULT 'En curso'::character varying,
    proxima_consulta date
);


ALTER TABLE public.tratamientos OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24711)
-- Name: tratamientos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tratamientos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tratamientos_id_seq OWNER TO postgres;

--
-- TOC entry 4839 (class 0 OID 0)
-- Dependencies: 221
-- Name: tratamientos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tratamientos_id_seq OWNED BY public.tratamientos.id;


--
-- TOC entry 4657 (class 2604 OID 24706)
-- Name: doctores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctores ALTER COLUMN id SET DEFAULT nextval('public.doctores_id_seq'::regclass);


--
-- TOC entry 4660 (class 2604 OID 24735)
-- Name: odontologos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.odontologos ALTER COLUMN id SET DEFAULT nextval('public.odontologos_id_seq'::regclass);


--
-- TOC entry 4656 (class 2604 OID 24697)
-- Name: pacientes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes ALTER COLUMN id SET DEFAULT nextval('public.pacientes_id_seq'::regclass);


--
-- TOC entry 4658 (class 2604 OID 24715)
-- Name: tratamientos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tratamientos ALTER COLUMN id SET DEFAULT nextval('public.tratamientos_id_seq'::regclass);


--
-- TOC entry 4826 (class 0 OID 24703)
-- Dependencies: 220
-- Data for Name: doctores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctores (id, nombre, apellido, especialidad, matricula) FROM stdin;
1	Luis	P‚rez	Odontolog¡a	OD12345
\.


--
-- TOC entry 4830 (class 0 OID 24732)
-- Dependencies: 224
-- Data for Name: odontologos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.odontologos (id, nombre, apellido, email, password_hash) FROM stdin;
1	federico	britez	frayg52@gmail.com	$2b$10$opcOOQZm7vB69KuYsjqh6u1mxTW39136DbDlw4xk67GM/bct96pY6
2	prueba	p	preuba@gmail.com	$2b$10$R3a895KkSAAZwMU.85FsTuSZGLDwonCVxf3Q5Ts/YCDjiv3/x0WEO
3	p	p	p@gmail.com	$2b$10$6B7aBQwzQ9H4CYA.KrEH7uW3DdSumeZMay3WYJYU7VKW1n05dkRbG
\.


--
-- TOC entry 4824 (class 0 OID 24694)
-- Dependencies: 218
-- Data for Name: pacientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pacientes (id, nombre, apellido, cedula, fecha_nacimiento, telefono, email, odontologo_id) FROM stdin;
4	Arnaldo Zavala	zavala1	\N	\N	0974551151	\N	1
5	Néstor.Lopez	\N	\N	\N	\N	\N	3
\.


--
-- TOC entry 4828 (class 0 OID 24712)
-- Dependencies: 222
-- Data for Name: tratamientos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tratamientos (id, paciente_id, doctor_id, fecha, diagnostico, procedimiento, observaciones, estado, proxima_consulta) FROM stdin;
\.


--
-- TOC entry 4840 (class 0 OID 0)
-- Dependencies: 219
-- Name: doctores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.doctores_id_seq', 1, true);


--
-- TOC entry 4841 (class 0 OID 0)
-- Dependencies: 223
-- Name: odontologos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.odontologos_id_seq', 3, true);


--
-- TOC entry 4842 (class 0 OID 0)
-- Dependencies: 217
-- Name: pacientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pacientes_id_seq', 5, true);


--
-- TOC entry 4843 (class 0 OID 0)
-- Dependencies: 221
-- Name: tratamientos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tratamientos_id_seq', 1, true);


--
-- TOC entry 4666 (class 2606 OID 24710)
-- Name: doctores doctores_matricula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctores
    ADD CONSTRAINT doctores_matricula_key UNIQUE (matricula);


--
-- TOC entry 4668 (class 2606 OID 24708)
-- Name: doctores doctores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctores
    ADD CONSTRAINT doctores_pkey PRIMARY KEY (id);


--
-- TOC entry 4672 (class 2606 OID 24741)
-- Name: odontologos odontologos_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.odontologos
    ADD CONSTRAINT odontologos_email_key UNIQUE (email);


--
-- TOC entry 4674 (class 2606 OID 24739)
-- Name: odontologos odontologos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.odontologos
    ADD CONSTRAINT odontologos_pkey PRIMARY KEY (id);


--
-- TOC entry 4662 (class 2606 OID 24701)
-- Name: pacientes pacientes_cedula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_cedula_key UNIQUE (cedula);


--
-- TOC entry 4664 (class 2606 OID 24699)
-- Name: pacientes pacientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_pkey PRIMARY KEY (id);


--
-- TOC entry 4670 (class 2606 OID 24720)
-- Name: tratamientos tratamientos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tratamientos
    ADD CONSTRAINT tratamientos_pkey PRIMARY KEY (id);


--
-- TOC entry 4675 (class 2606 OID 24742)
-- Name: pacientes pacientes_odontologo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_odontologo_id_fkey FOREIGN KEY (odontologo_id) REFERENCES public.odontologos(id);


--
-- TOC entry 4676 (class 2606 OID 24726)
-- Name: tratamientos tratamientos_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tratamientos
    ADD CONSTRAINT tratamientos_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctores(id);


--
-- TOC entry 4677 (class 2606 OID 24721)
-- Name: tratamientos tratamientos_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tratamientos
    ADD CONSTRAINT tratamientos_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id);


-- Completed on 2025-07-26 10:40:45

--
-- PostgreSQL database dump complete
--

