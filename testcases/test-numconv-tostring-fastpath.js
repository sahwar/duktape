/*
 *  Test the 32-bit fast path which applies to integers in the
 *  range [-2**32-1,2**32-1], in any radix.
 *
 *  The test is not exhaustive but has a pretty large (prime)
 *  skip; both endpoint values are always included though.
 */

/*---
{
    "slow": true
}
---*/

/* FIXME: util */
/* Trivial string checksum used to summarize brute force output lines
 * (minimizes test case size).
 */
function checkSumString(x) {
    var i, n;
    var res = 0;
    var mult = [ 1, 3, 5, 7, 11, 13, 17, 19, 23 ];

    n = x.length;
    for (i = 0; i < n; i++) {
        res += x.charCodeAt(i) * mult[i % mult.length];
        res = res >>> 0;  // coerce to 32 bits
    }

    return res;
}

/*---
{
    "custom": true
}
---*/

/*===
radix 2
179306267
178417689
172469437
158113487
164522390
171053804
173839346
73212146
radix 3
120001562
116340620
114838710
104289556
107366288
110915012
112538566
49058085
radix 4
93996707
93956672
93119252
85264205
87138494
90633905
90749467
38267839
radix 5
85524532
85420528
83386734
75416390
76399706
79977948
80054256
33672687
radix 6
80375401
79136945
75214944
69706448
69994308
72423839
75586644
31904527
radix 7
75660318
75401474
70356910
65459640
64698752
68090646
70718420
29706955
radix 8
70760327
70625152
69485827
61898015
62283468
65132380
65228960
27580869
radix 9
69419812
65527610
65200854
59988264
60261022
60887826
62388478
27476559
radix 10
65687102
65545878
64772404
57882489
57783900
60948995
61112511
25716773
radix 11
69166623
68000038
64211306
59710995
59000300
61402648
64314472
27317298
radix 12
67632900
67294827
66690879
60164747
60799276
62204906
62065132
26522442
radix 13
69740341
69516644
68895103
62262756
60104065
64690764
64292443
27542684
radix 14
71598398
72081748
68929359
62685443
57389876
65748807
66567837
28755782
radix 15
72430006
71848282
67985208
62706717
58859470
59698249
66875878
28526129
radix 16
73769135
70397366
68140205
62925422
60428538
60547551
60928624
25686087
radix 17
70912771
69704402
69358933
64554822
58820477
61931012
61985987
26129087
radix 18
71231524
71051252
70966883
62227667
69575090
63280736
63297516
26699407
radix 19
72743265
71638726
71595990
62378229
61170069
64639168
64361287
27150427
radix 20
73544332
73219218
69908335
62933335
65249346
65680945
65650006
27355150
radix 21
73704427
73519719
70395924
63441542
63940685
72906696
67058764
27766841
radix 22
75433924
74338906
67871773
64092473
63565508
66619708
67094279
28763924
radix 23
73850335
69301782
68368528
64488785
63024653
68066056
66847488
28551783
radix 24
70204641
70017694
68737246
64845718
63541335
66918926
69254539
29132129
radix 25
70855845
70301783
69537281
64991486
64441155
65518746
69378566
29362760
radix 26
71640896
70461614
70154774
65236955
64792347
65106858
68281845
29798072
radix 27
71552515
71030799
70959577
65368358
65244965
65649571
65944648
29468067
radix 28
71962251
71587113
71715547
65252620
65591519
66057948
66957378
28114849
radix 29
72491759
72457349
72335730
64922366
65489259
66863734
67087226
28487426
radix 30
73411662
72922686
72917156
64750239
66035368
67029068
67666075
28850587
radix 31
73970452
73659060
73152390
64581272
65701329
68585956
67311642
29290105
radix 32
74485135
74394511
73420892
64549058
65141537
68639239
68711056
29925749
radix 33
74926889
74885711
72847827
64654882
65104908
69566120
69322629
27930453
radix 34
75281549
76214857
72254342
64501263
65445833
68521664
69218983
30036608
radix 35
75808277
75869094
72102173
64555847
65319460
67574813
71497041
28178381
radix 36
77635113
75194087
72176214
64588163
65418360
67316650
71241876
30814244
===*/

function fastPathTest() {
    var start = -256*256*256*256 + 1;
    var end = 256*256*256*256 - 1;
    var step = 115757;  // prime
    var i;
    var radix;
    var tmp = [];

    function flush() {
        if (tmp.length > 0) {
            // Note: here we're printing a checksum which is a small integer,
            // so the checksum will go through the same fast path.
            print(checkSumString(tmp.join(' ')));
            tmp.length = 0;
        }
    }

    function f(x) {
        tmp.push(x);
        if (tmp.length >= 10000) {
            flush();
        }
    }

    for (radix = 2; radix <= 36; radix++) {
        print('radix', radix);
        i = start;
        for (;;) {
            f(new Number(i).toString(radix));

            if (i >= end) {
                break;
            }
            i += step;
            if (i >= end) {
                i = end;  // always include end
            }
        }
        flush();
    }
}

try {
    fastPathTest();
} catch (e) {
    print(e);
}

