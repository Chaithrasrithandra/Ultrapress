CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



SET default_table_access_method = heap;

--
-- Name: compression_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.compression_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    file_name text NOT NULL,
    original_size integer NOT NULL,
    compressed_size integer NOT NULL,
    compression_ratio numeric NOT NULL,
    redundancy_detected integer NOT NULL,
    compression_time numeric NOT NULL,
    compressed_content text NOT NULL,
    original_content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: compression_history compression_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compression_history
    ADD CONSTRAINT compression_history_pkey PRIMARY KEY (id);


--
-- Name: idx_compression_history_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_compression_history_created_at ON public.compression_history USING btree (created_at DESC);


--
-- Name: idx_compression_history_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_compression_history_user_id ON public.compression_history USING btree (user_id);


--
-- Name: compression_history Users can create their own history; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own history" ON public.compression_history FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: compression_history Users can delete their own history; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own history" ON public.compression_history FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: compression_history Users can view their own history; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own history" ON public.compression_history FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: compression_history; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.compression_history ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


