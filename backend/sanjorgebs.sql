--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-08-21 17:56:25

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
-- TOC entry 224 (class 1259 OID 32850)
-- Name: conceptos_pago; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conceptos_pago (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    precio_base numeric(10,2) NOT NULL,
    activo boolean DEFAULT true
);


ALTER TABLE public.conceptos_pago OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 32849)
-- Name: conceptos_pago_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.conceptos_pago_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.conceptos_pago_id_seq OWNER TO postgres;

--
-- TOC entry 4879 (class 0 OID 0)
-- Dependencies: 223
-- Name: conceptos_pago_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.conceptos_pago_id_seq OWNED BY public.conceptos_pago.id;


--
-- TOC entry 228 (class 1259 OID 32881)
-- Name: detalles_pago; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalles_pago (
    id integer NOT NULL,
    pago_id integer,
    concepto_id integer,
    cantidad integer DEFAULT 1,
    precio_unitario numeric(10,2) NOT NULL,
    descuento numeric(10,2) DEFAULT 0,
    subtotal numeric(10,2) GENERATED ALWAYS AS (((precio_unitario * (cantidad)::numeric) - descuento)) STORED
);


ALTER TABLE public.detalles_pago OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 32880)
-- Name: detalles_pago_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detalles_pago_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detalles_pago_id_seq OWNER TO postgres;

--
-- TOC entry 4880 (class 0 OID 0)
-- Dependencies: 227
-- Name: detalles_pago_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detalles_pago_id_seq OWNED BY public.detalles_pago.id;


--
-- TOC entry 230 (class 1259 OID 32901)
-- Name: historial_pagos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_pagos (
    id integer NOT NULL,
    pago_id integer,
    monto numeric(10,2) NOT NULL,
    fecha timestamp with time zone DEFAULT now(),
    metodo_pago character varying(50),
    referencia character varying(100),
    usuario_id integer
);


ALTER TABLE public.historial_pagos OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 32900)
-- Name: historial_pagos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_pagos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_pagos_id_seq OWNER TO postgres;

--
-- TOC entry 4881 (class 0 OID 0)
-- Dependencies: 229
-- Name: historial_pagos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_pagos_id_seq OWNED BY public.historial_pagos.id;


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
-- TOC entry 4882 (class 0 OID 0)
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
-- TOC entry 4883 (class 0 OID 0)
-- Dependencies: 217
-- Name: pacientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pacientes_id_seq OWNED BY public.pacientes.id;


--
-- TOC entry 226 (class 1259 OID 32860)
-- Name: pagos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagos (
    id integer NOT NULL,
    paciente_id integer,
    tratamiento_id integer,
    fecha timestamp with time zone DEFAULT now(),
    monto_total numeric(10,2) NOT NULL,
    estado character varying(20),
    metodo_pago character varying(50),
    notas text,
    CONSTRAINT pagos_estado_check CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'parcial'::character varying, 'completado'::character varying, 'cancelado'::character varying])::text[])))
);


ALTER TABLE public.pagos OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 32859)
-- Name: pagos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pagos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pagos_id_seq OWNER TO postgres;

--
-- TOC entry 4884 (class 0 OID 0)
-- Dependencies: 225
-- Name: pagos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pagos_id_seq OWNED BY public.pagos.id;


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
    proxima_consulta date,
    hora time without time zone,
    motivo character varying(255)
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
-- TOC entry 4885 (class 0 OID 0)
-- Dependencies: 219
-- Name: tratamientos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tratamientos_id_seq OWNED BY public.tratamientos.id;


--
-- TOC entry 4677 (class 2604 OID 32853)
-- Name: conceptos_pago id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conceptos_pago ALTER COLUMN id SET DEFAULT nextval('public.conceptos_pago_id_seq'::regclass);


--
-- TOC entry 4681 (class 2604 OID 32884)
-- Name: detalles_pago id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_pago ALTER COLUMN id SET DEFAULT nextval('public.detalles_pago_id_seq'::regclass);


--
-- TOC entry 4685 (class 2604 OID 32904)
-- Name: historial_pagos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_pagos ALTER COLUMN id SET DEFAULT nextval('public.historial_pagos_id_seq'::regclass);


--
-- TOC entry 4674 (class 2604 OID 32830)
-- Name: odontologos_unificados id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.odontologos_unificados ALTER COLUMN id SET DEFAULT nextval('public.odontologos_unificados_id_seq'::regclass);


--
-- TOC entry 4671 (class 2604 OID 24697)
-- Name: pacientes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes ALTER COLUMN id SET DEFAULT nextval('public.pacientes_id_seq'::regclass);


--
-- TOC entry 4679 (class 2604 OID 32863)
-- Name: pagos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos ALTER COLUMN id SET DEFAULT nextval('public.pagos_id_seq'::regclass);


--
-- TOC entry 4672 (class 2604 OID 24715)
-- Name: tratamientos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tratamientos ALTER COLUMN id SET DEFAULT nextval('public.tratamientos_id_seq'::regclass);


--
-- TOC entry 4867 (class 0 OID 32850)
-- Dependencies: 224
-- Data for Name: conceptos_pago; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conceptos_pago (id, nombre, descripcion, precio_base, activo) FROM stdin;
\.


--
-- TOC entry 4871 (class 0 OID 32881)
-- Dependencies: 228
-- Data for Name: detalles_pago; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detalles_pago (id, pago_id, concepto_id, cantidad, precio_unitario, descuento) FROM stdin;
\.


--
-- TOC entry 4873 (class 0 OID 32901)
-- Dependencies: 230
-- Data for Name: historial_pagos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_pagos (id, pago_id, monto, fecha, metodo_pago, referencia, usuario_id) FROM stdin;
\.


--
-- TOC entry 4865 (class 0 OID 32827)
-- Dependencies: 222
-- Data for Name: odontologos_unificados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.odontologos_unificados (id, nombre, apellido, email, password_hash, especialidad, matricula, creado_en) FROM stdin;
1	Naira	David	naira.david@sanjorge.com	$2b$10$3NL5mKYNKWnxc6GJhaYPR.zla32DQQhVNqwFB3u/G1HOzdd3MlcL.	Administrador	5156652	2025-08-21 17:28:11.852853
2	Alfredo	Benitez	alfredo.benitez@sanjorge.com	$2b$10$F2hsG4VSAyO3NzF5OK8EcemUUXuGkkVc90AXhRV6gXfBuDd1IRbhO	Administrador	1064599	2025-08-21 17:39:08.951171
\.


--
-- TOC entry 4861 (class 0 OID 24694)
-- Dependencies: 218
-- Data for Name: pacientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pacientes (id, nombre, apellido, cedula, fecha_nacimiento, telefono, email, odontologo_id) FROM stdin;
\.


--
-- TOC entry 4869 (class 0 OID 32860)
-- Dependencies: 226
-- Data for Name: pagos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pagos (id, paciente_id, tratamiento_id, fecha, monto_total, estado, metodo_pago, notas) FROM stdin;
\.


--
-- TOC entry 4863 (class 0 OID 24712)
-- Dependencies: 220
-- Data for Name: tratamientos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tratamientos (id, paciente_id, odontologo_id, fecha, diagnostico, procedimiento, observaciones, estado, proxima_consulta, hora, motivo) FROM stdin;
\.


--
-- TOC entry 4886 (class 0 OID 0)
-- Dependencies: 223
-- Name: conceptos_pago_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.conceptos_pago_id_seq', 1, false);


--
-- TOC entry 4887 (class 0 OID 0)
-- Dependencies: 227
-- Name: detalles_pago_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detalles_pago_id_seq', 1, false);


--
-- TOC entry 4888 (class 0 OID 0)
-- Dependencies: 229
-- Name: historial_pagos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_pagos_id_seq', 1, false);


--
-- TOC entry 4889 (class 0 OID 0)
-- Dependencies: 221
-- Name: odontologos_unificados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.odontologos_unificados_id_seq', 2, true);


--
-- TOC entry 4890 (class 0 OID 0)
-- Dependencies: 217
-- Name: pacientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pacientes_id_seq', 1, false);


--
-- TOC entry 4891 (class 0 OID 0)
-- Dependencies: 225
-- Name: pagos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pagos_id_seq', 1, false);


--
-- TOC entry 4892 (class 0 OID 0)
-- Dependencies: 219
-- Name: tratamientos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tratamientos_id_seq', 1, false);


--
-- TOC entry 4699 (class 2606 OID 32858)
-- Name: conceptos_pago conceptos_pago_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conceptos_pago
    ADD CONSTRAINT conceptos_pago_pkey PRIMARY KEY (id);


--
-- TOC entry 4703 (class 2606 OID 32889)
-- Name: detalles_pago detalles_pago_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_pago
    ADD CONSTRAINT detalles_pago_pkey PRIMARY KEY (id);


--
-- TOC entry 4705 (class 2606 OID 32907)
-- Name: historial_pagos historial_pagos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_pagos
    ADD CONSTRAINT historial_pagos_pkey PRIMARY KEY (id);


--
-- TOC entry 4695 (class 2606 OID 32838)
-- Name: odontologos_unificados odontologos_unificados_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.odontologos_unificados
    ADD CONSTRAINT odontologos_unificados_email_key UNIQUE (email);


--
-- TOC entry 4697 (class 2606 OID 32836)
-- Name: odontologos_unificados odontologos_unificados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.odontologos_unificados
    ADD CONSTRAINT odontologos_unificados_pkey PRIMARY KEY (id);


--
-- TOC entry 4689 (class 2606 OID 24701)
-- Name: pacientes pacientes_cedula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_cedula_key UNIQUE (cedula);


--
-- TOC entry 4691 (class 2606 OID 24699)
-- Name: pacientes pacientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_pkey PRIMARY KEY (id);


--
-- TOC entry 4701 (class 2606 OID 32869)
-- Name: pagos pagos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pkey PRIMARY KEY (id);


--
-- TOC entry 4693 (class 2606 OID 24720)
-- Name: tratamientos tratamientos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tratamientos
    ADD CONSTRAINT tratamientos_pkey PRIMARY KEY (id);


--
-- TOC entry 4711 (class 2606 OID 32895)
-- Name: detalles_pago detalles_pago_concepto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_pago
    ADD CONSTRAINT detalles_pago_concepto_id_fkey FOREIGN KEY (concepto_id) REFERENCES public.conceptos_pago(id);


--
-- TOC entry 4712 (class 2606 OID 32890)
-- Name: detalles_pago detalles_pago_pago_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_pago
    ADD CONSTRAINT detalles_pago_pago_id_fkey FOREIGN KEY (pago_id) REFERENCES public.pagos(id) ON DELETE CASCADE;


--
-- TOC entry 4713 (class 2606 OID 32908)
-- Name: historial_pagos historial_pagos_pago_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_pagos
    ADD CONSTRAINT historial_pagos_pago_id_fkey FOREIGN KEY (pago_id) REFERENCES public.pagos(id) ON DELETE CASCADE;


--
-- TOC entry 4714 (class 2606 OID 32913)
-- Name: historial_pagos historial_pagos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_pagos
    ADD CONSTRAINT historial_pagos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.odontologos_unificados(id);


--
-- TOC entry 4706 (class 2606 OID 32844)
-- Name: pacientes pacientes_odontologo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_odontologo_id_fkey FOREIGN KEY (odontologo_id) REFERENCES public.odontologos_unificados(id) ON DELETE CASCADE;


--
-- TOC entry 4709 (class 2606 OID 32870)
-- Name: pagos pagos_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id) ON DELETE CASCADE;


--
-- TOC entry 4710 (class 2606 OID 32875)
-- Name: pagos pagos_tratamiento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_tratamiento_id_fkey FOREIGN KEY (tratamiento_id) REFERENCES public.tratamientos(id) ON DELETE SET NULL;


--
-- TOC entry 4707 (class 2606 OID 32839)
-- Name: tratamientos tratamientos_odontologo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tratamientos
    ADD CONSTRAINT tratamientos_odontologo_id_fkey FOREIGN KEY (odontologo_id) REFERENCES public.odontologos_unificados(id) ON DELETE CASCADE;


--
-- TOC entry 4708 (class 2606 OID 24721)
-- Name: tratamientos tratamientos_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tratamientos
    ADD CONSTRAINT tratamientos_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id);


-- Completed on 2025-08-21 17:56:25

--
-- PostgreSQL database dump complete
--

