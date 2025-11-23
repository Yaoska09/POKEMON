#!/usr/bin/env python3
# mac_address.py
# Devuelve una o varias direcciones MAC del equipo en formato XX:XX:XX:XX:XX:XX
# Puede usarse como módulo (get_mac_addresses()) o como script (imprime JSON).

import sys
import json
import re
import platform
import subprocess
from uuid import getnode as uuid_getnode

def format_mac(mac_int):
    """Formatea un entero MAC a XX:XX:.. en mayúsculas"""
    mac_hex = f"{mac_int:012x}"
    return ":".join(mac_hex[i:i+2] for i in range(0, 12, 2)).upper()

def get_mac_by_uuid():
    """Intenta obtener MAC con uuid.getnode()"""
    node = uuid_getnode()
    # uuid.getnode() devuelve un entero. Si el bit multicast está puesto
    # podría ser una dirección generada aleatoriamente. No obstante lo intentamos.
    if (node >> 40) & 0x01:
        # bit multicast = 1 -> posible valor no fiable
        return None
    return format_mac(node)

def run_cmd(cmd):
    try:
        out = subprocess.check_output(cmd, stderr=subprocess.DEVNULL, shell=True, universal_newlines=True)
        return out
    except Exception:
        return ""

def extract_macs_from_text(text):
    # Regex para direcciones MAC separadas por : - o -
    mac_regex = re.compile(r'([0-9A-Fa-f]{2}([:\-])[0-9A-Fa-f]{2}(\2[0-9A-Fa-f]{2}){4})')
    matches = mac_regex.findall(text)
    unique = []
    for m in matches:
        mac = m[0].replace('-', ':').upper()
        if mac not in unique:
            unique.append(mac)
    return unique

def get_mac_by_cmd():
    sys_plat = platform.system().lower()
    outputs = []
    if sys_plat == "linux" or sys_plat == "darwin":
        # intentar ip link
        out = run_cmd("ip link show")
        if out:
            outputs.append(out)
        else:
            # fallback ifconfig
            outputs.append(run_cmd("ifconfig -a"))
    elif sys_plat == "windows":
        # getmac y ipconfig
        outputs.append(run_cmd("getmac /v /fo list"))
        outputs.append(run_cmd("ipconfig /all"))
    else:
        # fallback genérico
        outputs.append(run_cmd("ifconfig -a"))
        outputs.append(run_cmd("ip link show"))

    text = "\n".join(outputs)
    macs = extract_macs_from_text(text)
    return macs

def get_mac_addresses(prefer_uuid=True):
    """
    Retorna una lista de direcciones MAC encontradas.
    Si prefer_uuid=True intenta uuid.getnode() primero (simple).
    """
    macs = []
    if prefer_uuid:
        m = get_mac_by_uuid()
        if m:
            macs.append(m)

    # obtener por comando (más exhaustivo)
    cmd_macs = get_mac_by_cmd()
    for mac in cmd_macs:
        if mac not in macs:
            macs.append(mac)

    # Si todavía vacío, intentar uuid aunque sea generado
    if not macs:
        node = uuid_getnode()
        macs.append(format_mac(node))

    return macs

# Si se ejecuta como script, imprimimos JSON simple (para que JS lo lea fácilmente)
if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Obtener direcciones MAC del equipo (salida JSON).")
    parser.add_argument("--single", action="store_true", help="Retornar solo la primera MAC encontrada.")
    args = parser.parse_args()

    macs = get_mac_addresses()
    if args.single:
        out = {"mac": macs[0] if macs else None}
    else:
        out = {"macs": macs}
    print(json.dumps(out))
