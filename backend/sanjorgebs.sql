--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-08-01 14:57:39

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
-- TOC entry 222 (class 1259 OID 32827)
-- Name: odontologos_unificados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.odontologos_unificados (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    email character varying(150),
    password_hash text,
    especialidad character varying(100) DEFAULT 'Odontolog¡a'::character varying,
    matricula character varying(100),
    creado_en timestamp without time zone DEFAULT now()
);


ALTER TABLE public.odontologos_unificados OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 32826)
-- Name: odontologos_unificados_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.odontologos_unificados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.odontologos_unificados_id_seq OWNER TO postgres;

--
-- TOC entry 4826 (class 0 OID 0)
-- Dependencies: 221
-- Name: odontologos_unificados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.odontologos_unificados_id_seq OWNED BY public.odontologos_unificados.id;


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
-- TOC entry 4827 (class 0 OID 0)
-- Dependencies: 217
-- Name: pacientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pacientes_id_seq OWNED BY public.pacientes.id;


--
-- TOC entry 220 (class 1259 OID 24712)
-- Name: tratamientos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tratamientos (
    id integer NOT NULL,
    paciente_id integer,
    odontologo_id integer,
    fecha date NOT NULL,
    diagnostico text,
    procedimiento text,
    observaciones text,
    estado character varying(50) DEFAULT 'En curso'::character varying,
    proxima_consulta date
);


ALTER TABLE public.tratamientos OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24711)
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
-- TOC entry 4828 (class 0 OID 0)
-- Dependencies: 219
-- Name: tratamientos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tratamientos_id_seq OWNED BY public.tratamientos.id;


--
-- TOC entry 4654 (class 2604 OID 32830)
-- Name: odontologos_unificados id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.odontologos_unificados ALTER COLUMN id SET DEFAULT nextval('public.odontologos_unificados_id_seq'::regclass);


--
-- TOC entry 4651 (class 2604 OID 24697)
-- Name: pacientes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes ALTER COLUMN id SET DEFAULT nextval('public.pacientes_id_seq'::regclass);


--
-- TOC entry 4652 (class 2604 OID 24715)
-- Name: tratamientos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tratamientos ALTER COLUMN id SET DEFAULT nextval('public.tratamientos_id_seq'::regclass);


--
-- TOC entry 4820 (class 0 OID 32827)
-- Dependencies: 222
-- Data for Name: odontologos_unificados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.odontologos_unificados (id, nombre, apellido, email, password_hash, especialidad, matricula, creado_en) FROM stdin;
1	federico	britez	frayg52@gmail.com	$2b$10$opcOOQZm7vB69KuYsjqh6u1mxTW39136DbDlw4xk67GM/bct96pY6	Odontolog¡a	\N	2025-07-28 08:54:32.059873
2	prueba	p	preuba@gmail.com	$2b$10$R3a895KkSAAZwMU.85FsTuSZGLDwonCVxf3Q5Ts/YCDjiv3/x0WEO	Odontolog¡a	\N	2025-07-28 08:54:32.059873
3	p	p	p@gmail.com	$2b$10$6B7aBQwzQ9H4CYA.KrEH7uW3DdSumeZMay3WYJYU7VKW1n05dkRbG	Odontolog¡a	\N	2025-07-28 08:54:32.059873
4	Luis	P‚rez	\N	\N	Odontolog¡a	OD12345	2025-07-28 08:54:44.280983
6	JOSE 	CARLOS	J@gmail.com	$2b$10$cWNrCOQH50xSdAlFnuvZFucw085LG.dTK0u47XuW67Fzubl2NfBrG	ORTODONCIA	5150902	2025-07-28 10:04:07.607589
7	jose 	cardozo	jose@gmail.com	$2b$10$KLPfaYV2aiq6WUxesCvG7e9Vf1hbGjiET2RJ0NdI2d/9rBSzbjil6	neurologo	4150902	2025-07-28 14:54:20.494568
8	jane	doe	german@gmail.com	$2b$10$s/on8INPrduENTOBF06u2.SxFn5LBaZ5qYLnU5xA/RAeet7VVY49S	Endodoncia	5150902	2025-07-31 10:13:37.006683
9	Arnaldo	zoilan	l@gmail.com	$2b$10$evNeA2yJHzHE9Uso1wDxY.SlNDqIfHeABKTX9kj5vE96KiDq0Aupm	Cirugía	5150902	2025-07-31 10:16:32.071063
\.


--
-- TOC entry 4816 (class 0 OID 24694)
-- Dependencies: 218
-- Data for Name: pacientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pacientes (id, nombre, apellido, cedula, fecha_nacimiento, telefono, email, odontologo_id) FROM stdin;
8	german	cano	\N	\N	0974551151	\N	7
9	ariel 	zoilan	\N	\N	097455156	\N	7
20	Arnaldo	cano	\N	\N	0974551151	\N	1
25	german	dasilva	\N	\N	0974777777	\N	3
\.


--
-- TOC entry 4818 (class 0 OID 24712)
-- Dependencies: 220
-- Data for Name: tratamientos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tratamientos (id, paciente_id, odontologo_id, fecha, diagnostico, procedimiento, observaciones, estado, proxima_consulta) FROM stdin;
5	8	7	2025-07-28	dfd	dasdad	asdadasdasdad	sdadasdsasda	2025-07-31
6	9	7	2025-07-23	dfd	dsa	asda	sdasdsadasdada	2025-07-31
24	20	1	2025-07-30	perdida de incicivos	extraccion		muerto	2025-08-06
25	20	1	2025-07-29	perdida de incicivos	cogida		sdasdsadasdada	2025-07-31
26	20	1	2025-07-31	perdida de incicivos	extraccion		muerto	2025-08-02
27	20	1	2025-07-30	pilpitis	extraccion		sdadasdsasda	2025-08-02
28	20	1	2025-07-30	cancer	cogida		dgfd	2025-08-09
\.


--
-- TOC entry 4829 (class 0 OID 0)
-- Dependencies: 221
-- Name: odontologos_unificados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.odontologos_unificados_id_seq', 9, true);


--
-- TOC entry 4830 (class 0 OID 0)
-- Dependencies: 217
-- Name: pacientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pacientes_id_seq', 26, true);


--
-- TOC entry 4831 (class 0 OID 0)
-- Dependencies: 219
-- Name: tratamientos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tratamientos_id_seq', 29, true);


--
-- TOC entry 4664 (class 2606 OID 32838)
-- Name: odontologos_unificados odontologos_unificados_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.odontologos_unificados
    ADD CONSTRAINT odontologos_unificados_email_key UNIQUE (email);


--
-- TOC entry 4666 (class 2606 OID 32836)
-- Name: odontologos_unificados odontologos_unificados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.odontologos_unificados
    ADD CONSTRAINT odontologos_unificados_pkey PRIMARY KEY (id);


--
-- TOC entry 4658 (class 2606 OID 24701)
-- Name: pacientes pacientes_cedula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_cedula_key UNIQUE (cedula);


--
-- TOC entry 4660 (class 2606 OID 24699)
-- Name: pacientes pacientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_pkey PRIMARY KEY (id);


--
-- TOC entry 4662 (class 2606 OID 24720)
-- Name: tratamientos tratamientos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tratamientos
    ADD CONSTRAINT tratamientos_pkey PRIMARY KEY (id);


--
-- TOC entry 4667 (class 2606 OID 32844)
-- Name: pacientes pacientes_odontologo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_odontologo_id_fkey FOREIGN KEY (odontologo_id) REFERENCES public.odontologos_unificados(id) ON DELETE CASCADE;


--
-- TOC entry 4668 (class 2606 OID 32839)
-- Name: tratamientos tratamientos_odontologo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tratamientos
    ADD CONSTRAINT tratamientos_odontologo_id_fkey FOREIGN KEY (odontologo_id) REFERENCES public.odontologos_unificados(id) ON DELETE CASCADE;


--
-- TOC entry 4669 (class 2606 OID 24721)
-- Name: tratamientos tratamientos_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tratamientos
    ADD CONSTRAINT tratamientos_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id);


-- Completed on 2025-08-01 14:57:39

--
-- PostgreSQL database dump complete
--

